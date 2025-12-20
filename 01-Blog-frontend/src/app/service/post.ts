import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// ⬅️ CRUCIAL: Hardcoded full URLs using your backend port
const BASE_URL = 'http://localhost:8080/api';
const POST_API = `${BASE_URL}/posts`;
const POSTS_FEED_API = `${BASE_URL}/posts`;
const BASE_FILE_SERVER_URL = `${BASE_URL}/files`; // Assuming a /media/ endpoint for serving files

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // In your post.service.ts
  createPostWithMedia(formData: FormData): Observable<any> {
    return this.http.post(`${BASE_URL}/posts`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  editPostWithMedia(postId: string, formData: FormData): Observable<any> {
    return this.http.put(`${BASE_URL}/posts/edit/${postId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  upload(file: File) {
    let from = new FormData;
    from.append('file', file)
    return this.http.post(BASE_URL + "/files", from)
  }

  private http = inject(HttpClient);
  /**
    * Fetches a single post by its unique ID.
    * @param postId The ID of the post to fetch.
    * @returns An Observable of the single Post object.
    */
  getPostById(postId: string | undefined): Observable<any> {
    // 💥 ASSUMING your backend has an endpoint like GET /api/posts/{postId}
    const url = `${POST_API}/${postId}`;
    return this.http.get<any>(url);
  }
  editPost(caption: string, title: string, media: string[], pId: string): Observable<HttpEvent<any>> {
    const url = `${POST_API}/edit/${pId}`;

    const req = new HttpRequest('PUT', url, { description: caption, title: title, media: media });
    return this.http.request(req);
  }
  // --- 1. POST CREATION METHOD (File Upload) ---
  deletePost(pId: string | undefined) {
    return this.http.delete(`${POST_API}/${pId}`)
  }
  hide(pId: string | undefined) {
    return this.http.patch(`${POST_API}/hide/${pId}`, {})
  }
  unHide(pId: string | undefined) {
    return this.http.patch(`${POST_API}/unhide/${pId}`, {})
  }
  /**
   * Sends a new post (caption and file) to the server using FormData.
   */
  createPost(caption: string, title: string, media: string[]): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', POST_API, { description: caption, title: title, media: media });
    return this.http.request(req);
  }
  uploadFile(form: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', BASE_FILE_SERVER_URL, form, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);

  }
  // --- 2. POST FETCHING METHOD (Infinite Scroll) ---

  /**
   * Fetches a page of posts for the infinite scroll feed.
   * @param page The 1-based page number from the Angular component (1, 2, 3, ...)
   * @param limit The number of items per page (maps to Spring 'size').
   * @returns An Observable of the backend Map: { posts: [...], hasNext: boolean }
   */
  getPostsFeed(page: number, limit: number = 10, forUser: string | null = null, admin: boolean = false): Observable<any> {
    // Adjust 1-based Angular page to 0-based Spring page
    const springPage = page - 1;
    // Build the query string using Spring's parameters: 'page' and 'size'
    let base = (admin) ? "http://localhost:8080/api/admin/posts" : POSTS_FEED_API
    const url = `${base}${(forUser == null || forUser === "") ? "" : `/posts/` + forUser}?page=${springPage}&size=${limit}`;
    // Expecting the Map<String, Object> response { posts: [...], hasNext: boolean }
    return this.http.get<any>(url);
  }


  // --- 3. HELPER METHOD (Media Serving) ---

  /**
   * Constructs the full public URL for a media file.
   */
  getMediaUrl(mediaPath: string): string {
    return `${BASE_FILE_SERVER_URL}${mediaPath}`;
  }
  getPostToEdit(postId: string | undefined): Observable<any> {
    // 💥 ASSUMING your backend has an endpoint like GET /api/posts/{postId}
    const url = `${POST_API}/edit/${postId}`;
    return this.http.get<any>(url);
  }
}