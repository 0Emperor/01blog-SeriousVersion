import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
import { CommonModule } from '@angular/common'; // Needed for *ngIf
import { PostService } from '../../service/post';
import { Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
interface MediaPreview {
  localUrl: string; 
  serverUrl: string; 
  serverFileName: string;
  type: 'image' | 'video' | 'other';
}

@Component({
  selector: 'app-post-compose',
  // Make sure these are in your module or component imports array!
  standalone: true, // Assuming standalone for simplicity, adjust if using modules
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './post-compose.html',
  styleUrl: './post-compose.scss'
})

export class PostCompose {
  // Access to the textarea for formatting
  @ViewChild('editorArea') editorArea!: ElementRef<HTMLTextAreaElement>;

  // File input reference
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Data Properties
  title: string = '';
  description: string = ''; // Markdown content

  // Media Management
  mediaFilenames: string[] = [];
  mediaPreviews: MediaPreview[] = [];

  // UI State Properties
  isPosting: boolean = false;
  postSuccess: boolean | null = null;
  isPreviewVisible: boolean = false; // Toggles the preview panel on mobile

  // Base URL for fetching files from the server
  private fileServerBaseUrl = 'http://localhost:8080/api/files';

  // Inject the PostService
  constructor(private postService: PostService, private router: Router) { }
  togglePreview(): void {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  /**
   * Handles file selection from the input, triggering an immediate upload for each file.
   */
  async handleFileInput(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const newFiles = target.files;

    if (!newFiles) return;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const localUrl = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other';

      // 1. Create a temporary preview object with a placeholder server URL
      const tempPreview: MediaPreview = {
        localUrl,
        serverUrl: 'uploading...', // Placeholder to indicate status
        serverFileName: '',
        type
      };
      this.mediaPreviews.push(tempPreview);

      try {
        // 2. Upload the file
        const serverFileName = await this.uploadSingleFile(file);

        // 3. Update the preview object with the final server data
        tempPreview.serverUrl = `${this.fileServerBaseUrl}/${serverFileName}`;
        tempPreview.serverFileName = serverFileName;

        // 4. Add the successful filename to the list for final post submission
        this.mediaFilenames.push(serverFileName);

      } catch (error) {
        console.error('File upload failed for:', file.name, error);
        // 5. Remove failed upload from previews and revoke local URL
        const index = this.mediaPreviews.findIndex(p => p.localUrl === localUrl);
        if (index !== -1) {
          URL.revokeObjectURL(localUrl);
          this.mediaPreviews.splice(index, 1);
          console.error(`Upload failed for ${file.name}. Item removed from preview.`);
        }
      }
    }
    // Reset file input value to allow selecting the same file again
    target.value = '';
  }
  addMediaLink(i: number) {
    let media = this.mediaPreviews[i];
    this.description += `![img](http://localhost:8080/api/files/${media.serverFileName})`
  }
  /**
   * Helper function to wrap the observable file upload into a promise.
   */
  private uploadSingleFile(file: File): Promise<string> {
    const formData = new FormData();
    // Assuming the server endpoint expects the file under the key 'file'
    formData.append('file', file, file.name);

    return new Promise((resolve, reject) => {
      // We cast postService to 'any' to avoid type errors since PostService definition isn't provided
      this.postService.uploadFile(formData).subscribe({
        next: (event: any) => {
          // Check for successful HTTP response and expected body data
          console.log(event.type)
          if (event.type === HttpEventType.Response && event.body) {
            resolve(event.body);
          }
        },
        error: (err: any) => reject(err),
        // Progress events can be used here to update a progress bar on the tempPreview
      });
    });
  }


  /**
   * Removes a media file by index and revokes its local URL.
   * NOTE: In a production app, this should also trigger a DELETE request to the server.
   */
  removeMedia(index: number): void {
    const preview = this.mediaPreviews[index];

    // Clean up the local URL
    URL.revokeObjectURL(preview.localUrl);

    // Remove filename from master list (if the upload was successful)
    const filenameIndex = this.mediaFilenames.indexOf(preview.serverFileName);
    if (filenameIndex !== -1) {
      this.mediaFilenames.splice(filenameIndex, 1);
    }

    // Remove from previews array
    this.mediaPreviews.splice(index, 1);
  }

  /**
   * Stubs the functionality for applying Markdown formatting to selected text.
   */
  formatText(tag: 'b' | 'i' | 'l'): void {
    const textarea = this.editorArea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.description.substring(start, end);
    if (!selectedText) {
      return;
    }
    console.log(selectedText)
    let wrappedText = selectedText;
    let prefix = '';
    let suffix = '';

    switch (tag) {
      case 'b':
        prefix = '**';
        suffix = '**';
        break;
      case 'i':
        prefix = '*';
        suffix = '*';
        break;
      case 'l':
        prefix = '![';
        suffix = '](place link here)';
        break;
    }

    wrappedText = prefix + selectedText + suffix;

    // Insert the wrapped text back into the description
    this.description =
      this.description.substring(0, start) +
      wrappedText +
      this.description.substring(end);

    // Focus and restore cursor position after inserting text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    }, 0);
  }
  get isMediaUploading(): boolean {
    // This logic replaces the complex call in the template's [disabled] attribute
    return this.mediaPreviews.some(p => p.serverUrl === 'uploading...');
  }
  /**
    * [NEW METHOD] Clicks the hidden file input to open the system file dialog.
    * This is what the user's visible button calls.
    */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  /**
   * Clears the form and navigates away.
   */
  cancelPost(): void {
    // Clean up local URLs to prevent memory leaks
    this.mediaPreviews.forEach(p => URL.revokeObjectURL(p.localUrl));

    this.title = '';
    this.description = '';
    this.mediaFilenames = [];
    this.mediaPreviews = [];

    // Navigate back to the home page or feed
    this.router.navigate(['/']);
  }

  /**
   * Submits the post data (Title, Description, and the list of media file names).
   */
  onSubmit(): void {
    const isUploading = this.mediaPreviews.some(p => p.serverUrl === 'uploading...');

    if (!this.title || !this.description) {
      console.error('Title and description cannot be empty.');
      return;
    }
    if (isUploading) {
      console.error('Please wait for all media files to finish uploading before publishing.');
      return;
    }

    this.isPosting = true;
    this.postSuccess = null;

    // The final body now sends the list of file names, not FormData
    const postBody = {
      title: this.title,
      description: this.description,
      mediaFilenames: this.mediaFilenames // Sending the list of names
    };

    // The service call is now expected to accept a JSON body
    this.postService.createPost(this.description,this.title,this.mediaFilenames).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.Response) {
          this.isPosting = false;
          this.postSuccess = true;
          console.log('Post created successfully!');
          this.cancelPost();
        }
      },
      error: (err: any) => {
        console.error('Post creation failed:', err);
        this.isPosting = false;
        this.postSuccess = false;
        console.error('Failed to create post. Please check the network tab.');
      }
    });
  }
}