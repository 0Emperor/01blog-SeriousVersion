import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../dto/dto';
import { Router } from '@angular/router';
import { UserHeaderComponent } from '../../users/user-header/user-header';
import { DatePipe } from '@angular/common';
import { Like } from '../../../service/like';
import { FormatCountsPipe } from '../../../pipe/format-counts-pipe';
import { PostService } from '../../../service/post';
import { ConfirmationModalComponent } from '../../admin/confirm/confirm';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-feed',
  imports: [UserHeaderComponent, DatePipe, FormatCountsPipe, ConfirmationModalComponent, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss'
})
export class PostFeed {
  @Input() post!: Post;
  @Output() postDeleted = new EventEmitter<string>();

  like = inject(Like);
  httpPost = inject(PostService);

  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  confirmButtonText: string = '';

  constructor(private router: Router) { }

  likeClicked() {
    this.like.aply(this.post.postId, this.post.isLiked).subscribe({
      next: (v) => {

        this.post.isLiked = v;
        if (v === true) {
          this.post.totalLikes++;
        } else {
          this.post.totalLikes--;
        }
      }
    });
  }

  navigate() {
    this.router.navigate(['post', this.post.postId])
  }

  editNavigate() {
    this.router.navigate(["edit", this.post.postId])
  }

  delete() {
    this.confirmMessage = "Are you sure you want to permanently delete this post? This action cannot be undone.";
    this.confirmButtonText = "Delete Permanently";
    this.showConfirmModal = true;
  }

  onConfirmDelete() {
    this.showConfirmModal = false;
    if (!this.post) return;

    this.httpPost.deletePost(this.post.postId).subscribe({
      next: () => {
        this.postDeleted.emit(this.post.postId);
      },
      error: (err) => console.error('Error deleting post:', err)
    });
  }
}
