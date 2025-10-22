import { Component, inject, Input } from '@angular/core';
import { CommentArea } from '../../comments/comment-area/comment-area';
import { MarkdownModule } from 'ngx-markdown';
import { Post } from '../../../dto/dto';
import { PostService } from '../../../service/post';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { UserHeaderComponent } from "../../users/user-header/user-header";
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { UserStore } from '../../../service/user';

@Component({
  selector: 'app-post-view',
  imports: [CommentArea, MarkdownModule, UserHeaderComponent, TimeAgoPipe,RouterLink],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss'
})
export class PostView {
  post: Post | null = null;
  loading = false;
  httpPost = inject(PostService)
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  current = inject(UserStore)
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
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }
  delete() {
    this.httpPost.delete(this.post?.postId).subscribe({
      next: () => {
        this.router.navigate(["home"])
      }
    })
  }
  hide() {
    this.httpPost.hide(this.post?.postId).subscribe({
      next: () => {
        if (this.post) {
          this.post.hidden = true;
        }
      }
    })
  }
  unHide() {
    this.httpPost.unHide(this.post?.postId).subscribe({
      next: () => {
        if (this.post) {
          this.post.hidden = false;
        }
      }
    })
  }
}
