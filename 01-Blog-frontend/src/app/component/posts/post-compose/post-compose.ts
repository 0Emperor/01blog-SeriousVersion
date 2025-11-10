import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { HttpEventType } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { PostService } from '../../../service/post'; // Adjust path

import Quill from 'quill';

const NEW_MEDIA_PLACEHOLDER = 'NEW_MEDIA_PLACEHOLDER_';

// --- NEW: Define and Register Custom Video Blot ---

// 1. Get the base class for "block-level" embeds
const BlockEmbed = Quill.import('blots/block/embed') as any;

// 2. Create our new custom video blot
class VideoBlot extends BlockEmbed {
  
  // This 'create' method is called when inserting the blot
  static create(value: string) {
    // 'node' is the DOM element we want to insert
    const node = super.create() as HTMLElement;
    
    // Set the attributes for a <video> tag
    node.setAttribute('src', value);
    node.setAttribute('controls', 'true'); // Add player controls
    node.setAttribute('width', '100%');   // Make it responsive
    node.setAttribute('style', 'max-height: 500px; display: block;'); // Constrain height and fix display
    
    return node;
  }

  // This 'value' method returns the blot's "data"
  static value(node: HTMLElement): string|null {
    return node.getAttribute('src');
  }
}

// 3. Define the blot's "name" and HTML tag
VideoBlot['blotName'] = 'video';
VideoBlot['tagName'] = 'video'; // We want it to create a <video> tag

// 4. Register our new blot, overwriting the old 'video' handler
Quill.register('formats/video', VideoBlot, true);

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule
  ],
  templateUrl: './post-compose.html',
  styleUrls: ['./post-compose.scss']
})
export class PostCompose implements OnInit {
  @Input() title = '';
  @Input() description = '';
  @Input() edit = ''; // This should be the post ID
  
  @Output() postCreated = new EventEmitter<any>();
  @Output() postUpdated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();
  
  @ViewChild(QuillEditorComponent, { static: false }) quillEditor!: QuillEditorComponent;
  
  postForm!: FormGroup;
  
  /**
   * RENAMED: Stores a map of preview URLs (Base64 or Blob)
   * to the actual File object selected by the user.
   */
  private fileUrlMap = new Map<string, File>(); 
  
  uploadProgress = 0;
  isSubmitting = false;
  isEditMode = false;
  
  // Base URL for your backend file server
  private readonly SERVER_FILE_URL_PREFIX = 'http://localhost:8080/api/files/';

  quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, false] }],
        ['image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => this.imageHandler(),
        video: () => this.videoHandler()
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private postService: PostService
  ) {
    // Note: The Quill.register call is now done outside the class,
    // so it's registered globally before the component is even constructed.
  }

  ngOnInit(): void {
    this.isEditMode = !!this.edit;
    
    this.postForm = this.fb.group({
      title: [this.title, [Validators.required, Validators.minLength(3), Validators.maxLength(17)]],
      description: [this.description, [Validators.required, Validators.minLength(10), Validators.maxLength(474800)]]
    });
  }

  // --- Media Handlers ---
  imageHandler(): void {
    this.selectAndInsertFile('image/*');
  }

  videoHandler(): void {
    this.selectAndInsertFile('video/*');
  }

  private selectAndInsertFile(accept: string): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', accept);
    input.click();
  
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const quill = this.quillEditor.quillEditor;
        const range = quill.getSelection(true);
        const embedType = accept.startsWith('image/') ? 'image' : 'video';
  
        if (embedType === 'image') {
          // --- IMAGE LOGIC ---
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const base64Url = e.target?.result as string;
            
            // Use the renamed fileUrlMap
            this.fileUrlMap.set(base64Url, file);
            
            quill.insertEmbed(range.index, 'image', base64Url, 'user');
            quill.setSelection(range.index + 1, 0);
          };
          reader.readAsDataURL(file);
  
        } else {
          // --- VIDEO LOGIC ---
          const blobUrl = URL.createObjectURL(file);
  
          // Use the renamed fileUrlMap
          this.fileUrlMap.set(blobUrl, file);
          
          // This will now work because 'CustomVideo' whitelists 'blob:'
          quill.insertEmbed(range.index, 'video', blobUrl, 'user');
          quill.setSelection(range.index + 1, 0);
        }
      }
    };
  }

  // --- Submission Logic ---

  async onSubmit(): Promise<void> {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.uploadProgress = 0;

    try {
      const formData = new FormData();
      formData.append('title', this.postForm.value.title);

      // 1. Process the HTML content to build media lists and placeholders
      const processed = this.processHtmlContent(this.postForm.value.description, formData);

      // 2. Append the processed description (with placeholders)
      formData.append('description', processed.finalHtml);
      
      // 3. Append the list of existing URLs to keep
      processed.keepMediaUrls.forEach(url => {
        formData.append('keepMedia', url);
      });

      // 4. Submit the single FormData object
      if (this.isEditMode) {
        this.postService.editPostWithMedia(this.edit, formData).subscribe({
          next: (event) => this.handleUploadEvent(event, true),
          error: (error) => this.handleError(error)
        });
      } else {
        this.postService.createPostWithMedia(formData).subscribe({
          next: (event) => this.handleUploadEvent(event, false),
          error: (error) => this.handleError(error)
        });
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Parses the editor's HTML content.
   * - Finds all new (data: or blob:) media and adds their *File* to `formData`.
   * - Finds all existing (server) media and adds them to a 'keep' list.
   * - Replaces data:/blob: URLs in the HTML with placeholders for the backend.
   */
  private processHtmlContent(html: string, formData: FormData): { finalHtml: string, keepMediaUrls: string[] } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mediaElements = doc.querySelectorAll('img[src], video[src]');
    
    const keepMediaUrls: string[] = [];
    let newMediaIndex = 0;

    mediaElements.forEach(el => {
      const src = el.getAttribute('src');
      if (!src) return;

      // --- UPDATED: Now checks for 'blob:' as well ---
      if (src.startsWith('data:') || src.startsWith('blob:')) {
        // This is a NEW file (Base64 for image, or Blob for video)
        const file = this.fileUrlMap.get(src);
        if (file) {
          // Add the *File* to FormData
          formData.append('newMedia', file, file.name);
          
          // Replace the 'src' with an indexed placeholder
          el.setAttribute('src', `${NEW_MEDIA_PLACEHOLDER}${newMediaIndex}`);
          newMediaIndex++;
        }
      } else if (src.startsWith(this.SERVER_FILE_URL_PREFIX)) {
        // This is an EXISTING file. Add its URL to the 'keep' list.
        keepMediaUrls.push(src);
      }
    });

    return {
      finalHtml: doc.body.innerHTML, // The HTML with placeholders
      keepMediaUrls: keepMediaUrls    // The list of existing URLs to keep
    };
  }


  // --- Event Handling and Cleanup ---

  private handleUploadEvent(event: any, isEdit: boolean): void {
    if (event.type === HttpEventType.UploadProgress) {
      this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
    } else if (event.type === HttpEventType.Response) {
      this.isSubmitting = false;
      if (isEdit) {
        this.postUpdated.emit(event.body);
      } else {
        this.postCreated.emit(event.body);
      }
      this.resetForm();
    }
  }

  private handleError(error: any): void {
    console.error('Error with post:', error);
    this.isSubmitting = false;
    this.uploadProgress = 0;
  }

  resetForm(): void {
    this.postForm.reset();
    this.fileUrlMap.clear(); // Clean up the map
    this.uploadProgress = 0;
    
    if (this.quillEditor?.quillEditor) {
      this.quillEditor.quillEditor.setText('');
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.resetForm();
  }
  
  // ... getters (titleControl, descriptionControl) ...
}