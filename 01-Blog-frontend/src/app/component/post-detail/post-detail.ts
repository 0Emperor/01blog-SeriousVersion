import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // ⬅️ NEW: Used for reading the URL parameter
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { PostService } from '../../service/post';
import { UserHeaderComponent } from '../user-header/user-header';

// Use the existing Post interface from the FeedComponent
interface Post {
  postId: string;
  description: string;
  mediaUrl: string;
  createdAt: Date;
  user: any; // UserSummary interface
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,UserHeaderComponent],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss'
})
export class PostDetailComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private router = inject(Router); // ⬅️ NEW: Inject Router
  post: Post | undefined;
  loading: boolean = true;
  /**
   * Navigates up one level in the router hierarchy to close the detail view.
   * /home/123 -> /home
   */
  closeDetail() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  ngOnInit() {
    // Read the 'id' parameter from the URL using ActivatedRoute
    this.route.paramMap.pipe(
      tap(() => this.loading = true),
      // switchMap to call the API with the ID
      switchMap(params => {
        const postId = params.get('id');
        if (postId) {
          // 💥 Assuming you have a getPostById API method (we'll add it next)
          return this.postService.getPostById(postId);
        }
        // Return an observable that emits nothing if no ID is present
        return new Promise(() => {}); 
      })
    ).subscribe({
      next: (data: any) => {
        this.post = data; // Assuming API returns the single Post object
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load post details:", err);
        this.loading = false;
        // Optionally redirect to 404 page
      }
    });
  }
}