import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor
import { BehaviorSubject, scan, switchMap, tap, filter } from 'rxjs';
import { PostService } from '../../service/post';
import { Post } from '../../dto/dto';

import { PostFeed } from "../post-feed/post-feed";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PostFeed],
  templateUrl: './feed.html', 
  styleUrl: './feed.scss'     
})
export class Feed implements OnInit { 
  
  // Dependency injection using the modern inject function
  private postService = inject(PostService);
  
  // State Management for Infinite Scroll
  private page$ = new BehaviorSubject<number>(1); 
  posts: Post[] = [];
  loading = false;
  finished = false; // Flag to stop loading when all data is fetched
  limit = 10; // Corresponds to the backend 'size' parameter

  ngOnInit() {
    this.setupFeedSubscription();
  }

  /**
   * Sets up the RxJS pipeline to fetch and accumulate posts across multiple pages.
   */
  setupFeedSubscription() {
    this.page$.pipe(
      // 1. Only fetch if we're not loading and haven't reached the end
      filter(page => page > 0 && !this.loading && !this.finished),
      tap(() => this.loading = true), // Start loading state
      
      // 2. Fetch data: switchMap cancels previous requests if page$ fires quickly
      switchMap(page => this.postService.getPostsFeed(page, this.limit)),
      
      // 3. Accumulate data: scan combines results from previous pages (acc) with new results (currentChunk)
      scan((acc: Post[], currentChunk: any) => {
        // Use the 'posts' key from the backend Map response
        const newPosts: Post[] = currentChunk.posts.map((post: any) => (post));

        // Use the 'hasNext' key from the backend Map response to reliably stop loading
        if (!currentChunk.hasNext) { 
          this.finished = true;
        }
        
        this.loading = false;
        return [...acc, ...newPosts]; // Accumulate all posts
      }, []) // Initial accumulator value is an empty array
    ).subscribe(allPosts => {
      this.posts = allPosts; 
      console.log(this.posts);
      // Update the component property bound to the template
    });
  }

  /**
   * Listens for scroll events on the window to trigger the next page load.
   */
  @HostListener('window:scroll', [])
  onScroll() {
    // Check if the user is near the bottom of the page (e.g., within 200px)
    const tolerance = 200;
    const scrollPosition = window.scrollY + window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;
    
    // Trigger next page if near bottom AND not currently loading AND not finished
    if (scrollPosition > totalHeight - tolerance && !this.loading && !this.finished) {
      this.loadNextPage();
    }
  }

  /**
   * Updates the BehaviorSubject to trigger the next data fetch.
   */
  loadNextPage() {
    this.page$.next(this.page$.value + 1);
  }
}