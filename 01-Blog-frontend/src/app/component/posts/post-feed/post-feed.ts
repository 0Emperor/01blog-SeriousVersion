import { Component, inject, Input } from '@angular/core';
import { Post } from '../../../dto/dto';
import { Router, RouterLink } from '@angular/router';
import { UserHeaderComponent } from '../../users/user-header/user-header';
import { DatePipe } from '@angular/common';
import { Like } from '../../../service/like';
import { FormatCountsPipe } from '../../../pipe/format-counts-pipe';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'app-post-feed',
  imports: [RouterLink, UserHeaderComponent, DatePipe, FormatCountsPipe, MarkdownComponent],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss'
})
export class PostFeed {
  @Input() post!: Post;
  like = inject(Like);
  constructor(private router: Router) { }
  likeClicked() {
    this.like.aply(this.post.postId, this.post.isLiked).subscribe({
      next: (v) => {
        console.log(v);
        this.post.isLiked = v;
        if (v === true) {
          this.post.totalLikes++;
        } else {
          this.post.totalLikes--;
        }
      }
    });
  }
  navigate(){
    this.router.navigate([this.post.postId])
  }
}
