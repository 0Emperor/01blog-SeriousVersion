import { Component, inject, Input, AfterViewInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { CommentArea } from '../../comments/comment-area/comment-area';
import { MarkdownModule } from 'ngx-markdown';
import { Post } from '../../../dto/dto';
import { PostService } from '../../../service/post';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { UserHeaderComponent } from "../../users/user-header/user-header";
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { UserStore } from '../../../service/user';
import { AdminService } from '../../../service/admin-service';
import { ReportPostComponent } from '../../report/report/report';
import { ConfirmationModalComponent } from "../../admin/confirm/confirm";
import { Like } from '../../../service/like';

import { MatDialog } from '@angular/material/dialog';
import { MediaLightboxComponent, MediaItem } from '../media-lightbox/media-lightbox.component';

@Component({
  selector: 'app-post-view',
  imports: [
    CommentArea,
    ReportPostComponent,
    MarkdownModule,
    UserHeaderComponent,
    TimeAgoPipe,
    RouterLink,
    ConfirmationModalComponent
  ],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss'
})
export class PostView implements AfterViewInit {
  post: Post | null = null;
  loading = false;
  httpPost = inject(PostService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  current = inject(UserStore);
  adminService = inject(AdminService);
  likeService = inject(Like);

  private dialog = inject(MatDialog);
  private elementRef = inject(ElementRef);
  private location = inject(Location);

  openReportModal: boolean = false;
  showConfirmModal: boolean = false;
  pendingAction: 'delete' | 'hide' | 'unhide' | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  isActionsMenuOpen = false;
  ngOnInit() {
    this.route.paramMap.pipe(
      tap(() => this.loading = true),
      switchMap(params => {
        const postId = params.get('id');
        if (postId) {
          return this.httpPost.getPostById(postId);
        }
        return new Promise(() => { });
      })
    ).subscribe({
      next: (data: any) => {
        this.post = data;
        console.log(this.post);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    // Add click listeners to media elements after view init
    setTimeout(() => this.attachMediaClickListeners(), 100);
  }

  private attachMediaClickListeners() {
    const contentElement = this.elementRef.nativeElement.querySelector('.text');
    if (!contentElement) return;

    // Add click listeners to images
    const images = contentElement.querySelectorAll('img');
    images.forEach((img: HTMLImageElement, index: number) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.openLightbox(index, 'image'));
    });

    // Add click listeners to videos
    const videos = contentElement.querySelectorAll('video');
    videos.forEach((video: HTMLVideoElement, index: number) => {
      video.style.cursor = 'pointer';
      video.addEventListener('click', () => this.openLightbox(images.length + index, 'video'));
    });
  }

  private extractMediaFromContent(): MediaItem[] {
    const contentElement = this.elementRef.nativeElement.querySelector('.text');
    if (!contentElement) return [];

    const media: MediaItem[] = [];

    // Extract images
    const images = contentElement.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      media.push({ type: 'image', url: img.src });
    });

    // Extract videos
    const videos = contentElement.querySelectorAll('video');
    videos.forEach((video: HTMLVideoElement) => {
      media.push({ type: 'video', url: video.src || video.querySelector('source')?.src || '' });
    });

    return media;
  }

  private openLightbox(index: number, type: 'image' | 'video') {
    const media = this.extractMediaFromContent();
    if (media.length === 0) return;

    this.dialog.open(MediaLightboxComponent, {
      data: { media, currentIndex: index },
      panelClass: 'lightbox-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%'
    });
  }

  toggleLike() {
    if (!this.post) return;

    const previousLikedState = this.post.isLiked;
    const previousLikeCount = this.post.totalLikes;

    // Optimistic update
    this.post.isLiked = !this.post.isLiked;
    this.post.totalLikes += this.post.isLiked ? 1 : -1;

    this.likeService.aply(this.post.postId, previousLikedState).subscribe({
      error: (err) => {
        // Revert on error
        if (this.post) {
          this.post.isLiked = previousLikedState;
          this.post.totalLikes = previousLikeCount;
        }
        console.error('Error toggling like:', err);
      }
    });
  }

  editNavigate() {
    this.router.navigate(["edit", this.post?.postId]);
  }

  triggerAdminAction(action: 'delete' | 'hide' | 'unhide') {
    if (!this.post) return;

    this.pendingAction = action;
    this.showConfirmModal = true;

    switch (action) {
      case 'delete':
        this.confirmMessage = "Are you sure you want to permanently delete this post? This action cannot be undone.";
        this.confirmButtonText = "Delete Permanently";
        break;
      case 'hide':
        this.confirmMessage = "Are you sure you want to hide this post? It will be invisible to non-admin users.";
        this.confirmButtonText = "Hide Post";
        break;
      case 'unhide':
        this.confirmMessage = "Are you sure you want to unhide this post? It will become visible to all users.";
        this.confirmButtonText = "Unhide Post";
        break;
    }
  }

  onConfirmAction() {
    this.showConfirmModal = false;
    if (!this.post || !this.pendingAction) return;

    const action = this.pendingAction;
    const postId = this.post.postId;
    let apiCall;

    switch (action) {
      case 'delete':
        apiCall = this.httpPost.deletePost(postId);
        break;
      case 'hide':
        apiCall = this.adminService.hide(postId);
        break;
      case 'unhide':
        apiCall = this.adminService.unhide(postId);
        break;
    }

    if (apiCall) {
      apiCall.subscribe({
        next: () => {
          if (action === 'delete') {
            this.location.back();
          } else if (this.post) {
            this.post.hidden = action === 'hide';
          }
        },
        error: (err) => console.error(`Error performing ${action} action:`, err)
      });
    }

    this.pendingAction = null;
  }

  delete() {
    this.triggerAdminAction('delete');
  }

  hide() {
    this.triggerAdminAction('hide');
  }

  unHide() {
    this.triggerAdminAction('unhide');
  }



  updateCommentCount(delta: number) {
    if (this.post) {
      this.post.commentsCount += delta;
    }
  }
}