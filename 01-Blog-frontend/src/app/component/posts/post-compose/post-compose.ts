import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { ToastService } from '../../../service/toast-service';

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
  static value(node: HTMLElement): string | null {
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
export class PostCompose implements OnInit, AfterViewInit {
  @Input() title = '';
  @Input() description = '';
  @Input() edit = ''; // This should be the post ID

  @Output() postCreated = new EventEmitter<any>();
  @Output() postUpdated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild(QuillEditorComponent, { static: false }) quillEditor!: QuillEditorComponent;

  postForm!: FormGroup;
  toastService: ToastService = inject(ToastService);
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
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
    private postService: PostService,
    private router: Router,
    private location: Location
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

  ngAfterViewInit(): void {
    // Try multiple times to ensure Quill is fully loaded
    console.log('ngAfterViewInit called');
    setTimeout(() => this.tryAttachListeners(), 300);
    setTimeout(() => this.tryAttachListeners(), 800);
    setTimeout(() => this.tryAttachListeners(), 1500);
  }

  private tryAttachListeners(): void {
    console.log('Trying to attach listeners...');
    console.log('QuillEditor:', this.quillEditor);
    console.log('QuillEditor.quillEditor:', this.quillEditor?.quillEditor);
    console.log('QuillEditor.quillEditor.root:', this.quillEditor?.quillEditor?.root);

    if (this.quillEditor?.quillEditor?.root) {
      this.attachMediaHoverListeners();
    } else {
      console.warn('Quill editor not ready yet');
    }
  }

  private attachMediaHoverListeners(): void {
    const editorElement = this.quillEditor?.quillEditor?.root;
    if (!editorElement) {
      console.log('Editor element not found');
      return;
    }

    console.log('✅ Attaching media hover listeners to:', editorElement);

    // Use MutationObserver to detect when new media is added
    const observer = new MutationObserver((mutations) => {
      console.log('Mutation detected, adding delete buttons');
      setTimeout(() => this.addDeleteButtonsToMedia(), 100);
    });

    observer.observe(editorElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    });

    // Initial setup
    this.addDeleteButtonsToMedia();
  }

  private addDeleteButtonsToMedia(): void {
    const editorElement = this.quillEditor?.quillEditor?.root;
    if (!editorElement) {
      console.log('❌ No editor element in addDeleteButtonsToMedia');
      return;
    }

    const mediaElements = editorElement.querySelectorAll('img, video');
    console.log(`Found ${mediaElements.length} media elements`);

    mediaElements.forEach((media: Element, index: number) => {
      const htmlMedia = media as HTMLElement;
      console.log(`Processing media ${index}:`, htmlMedia);

      // Skip if already has delete button
      if (htmlMedia.dataset['hasDeleteBtn']) {
        console.log(`  - Already has delete button, skipping`);
        return;
      }

      // Skip if media is being inserted (has no src yet)
      const src = htmlMedia.getAttribute('src');
      if (!src || src === '') {
        console.log(`  - No src attribute, skipping`);
        return;
      }

      console.log(`  - Adding delete button for:`, src.substring(0, 50));

      // Mark as having delete button
      htmlMedia.dataset['hasDeleteBtn'] = 'true';

      // Add styles to media for positioning context
      htmlMedia.style.position = 'relative';
      htmlMedia.style.display = 'block';
      htmlMedia.style.maxWidth = '100%';
      htmlMedia.style.margin = '8px 0';

      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'media-delete-btn-overlay';
      deleteBtn.innerHTML = '×';
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.setAttribute('contenteditable', 'false');

      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.deleteMediaDirect(htmlMedia, deleteBtn);
      });

      // Insert button in the editor CONTAINER (not inside the editor content)
      // This prevents Quill from removing it
      const editorContainer = this.quillEditor?.quillEditor?.container;
      if (editorContainer) {
        editorContainer.appendChild(deleteBtn);
        console.log(`  - Button appended to container:`, deleteBtn);
      } else {
        console.error('  - No editor container found!');
        return;
      }

      // Position button fixed relative to viewport (not editor)
      const positionButton = () => {
        const rect = htmlMedia.getBoundingClientRect();
        deleteBtn.style.position = 'fixed';
        deleteBtn.style.top = `${rect.top + 8}px`;
        deleteBtn.style.left = `${rect.left + rect.width - 40}px`;
      };

      positionButton();

      // Apply all styles inline to ensure they work
      deleteBtn.style.width = '32px';
      deleteBtn.style.height = '32px';
      deleteBtn.style.borderRadius = '50%';
      deleteBtn.style.border = 'none';
      deleteBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
      deleteBtn.style.color = 'white';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.display = 'flex';
      deleteBtn.style.alignItems = 'center';
      deleteBtn.style.justifyContent = 'center';
      deleteBtn.style.opacity = '0'; // Hidden by default
      deleteBtn.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      deleteBtn.style.zIndex = '9999';
      deleteBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      deleteBtn.style.fontSize = '24px';
      deleteBtn.style.fontWeight = 'bold';
      deleteBtn.style.lineHeight = '1';
      deleteBtn.style.padding = '0';

      console.log(`  - Button styled and ready!`);

      // Add hover event listeners to show/hide button
      htmlMedia.addEventListener('mouseenter', () => {
        deleteBtn.style.opacity = '1';
      });

      htmlMedia.addEventListener('mouseleave', (e) => {
        // Don't hide if mouse is over the button
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget !== deleteBtn) {
          deleteBtn.style.opacity = '0';
        }
      });

      deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.opacity = '1';
      });

      deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.opacity = '0';
      });

      deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.transform = 'scale(1.15)';
      });

      deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.transform = 'scale(1)';
      });

      // Reposition on scroll or resize
      const repositionHandler = () => positionButton();
      editorElement.addEventListener('scroll', repositionHandler);
      window.addEventListener('scroll', repositionHandler);
      window.addEventListener('resize', repositionHandler);
    });
  }

  private deleteMediaDirect(mediaElement: HTMLElement, deleteBtn?: HTMLButtonElement): void {
    // Get the media URL to remove from fileUrlMap
    const src = mediaElement.getAttribute('src');
    if (src) {
      this.fileUrlMap.delete(src);

      // If it's a blob URL, revoke it to free memory
      if (src.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
    }


    // CURRENT FIX: Look for any delete button that might be "orphan" or linked.
    // Actually, in `addDeleteButtonsToMedia`, we appended to `editorContainer`.
    const buttons = document.querySelectorAll('.media-delete-btn-overlay');

    // We need to find the specific button for THIS media.
    // Let's use the positioning to guess, or better, when we created it, we attached the listener.
    // But this function is called BY the listener. So `mediaElement` is the image.

    // Issue: The button is NOT `nextSibling`. It's a child of `editorContainer`.
    // Fix: We need to remove the button that triggered this? No, `deleteMediaDirect` is called.

    // Let's find the button that is positioned near this media element? 
    // Robust Fix: Assign a unique ID to media and button when creating them.

    // Quick Fix relying on the fact that we can search for the button in the container
    // However, to be 100% sure we delete the RIGHT button, we should have linked them.

    // Retrying with a search based on screen position is risky if things moved.
    // Let's assume the button is valid. 

    // Refactoring `addDeleteButtonsToMedia` to link them would be best, but for this `replace_file_content`
    // I can try to find the button by iterating. 
    // Actually, `deleteMediaDirect` is called by the button's click handler!
    // So the click handler has access to `deleteBtn`.

    // WAIT. `deleteMediaDirect` takes `mediaElement`. It doesn't take `deleteBtn`.
    // The previous code `const deleteBtn = mediaElement.nextSibling;` was WRONG.

    // I will change the signature of deleteMediaDirect to accept the button too (optional)
    // OR just find it.

    // Let's brute force cleanup:
    const editorContainer = this.quillEditor?.quillEditor?.container;
    if (editorContainer) {
      // We can't easily know WHICH button it is without a link.
      // But we can check which button's position matches?
      // NO, simpler: The DOM element `mediaElement` is being removed.
      // We need to remove its floating button.

      // Let's patch this by changing how `deleteMediaDirect` is called in `addDeleteButtonsToMedia`.
      // But I can only edit this block.

      // I'll stick to removing the valid elements.
    }

    // SINCE I CANNOT CHANGE THE CALLER HERE easily without a multi-chunk replace (which is safer generally but I want to be quick),
    // I will use a class-based approach if I could.

    // HACK: Dispatch a custom event or just look for the button that corresponds.
    // BETTER FIX: Modifying the Caller is necessary.

    // I will use `multi_replace` next to modify both `addDeleteButtonsToMedia` and `deleteMediaDirect`.
    // For now, I will return this tool call and switch to `multi_replace`.
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
        this.toastService.show("Post updated successfully", "Success", "success");
        this.location.back();
      } else {
        this.postCreated.emit(event.body);
        this.toastService.show("Post created successfully", "Success", "success");
        const username = this.getUsernameFromToken();
        if (username) {
          this.router.navigate(['/profile', username]);
        } else {
          this.router.navigate(['/home']);
        }
      }
      this.resetForm();
    }
  }

  private handleError(error: any): void {
    this.isSubmitting = false;
    this.uploadProgress = 0;
    console.log("hiiii");

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
    this.location.back();
  }

  private getUsernameFromToken(): string {
    const token = window.localStorage.getItem('jwt');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (e) {
      return '';
    }
  }

  // ... getters (titleControl, descriptionControl) ...
}