import { Component, inject, Input } from '@angular/core';
import { CommentArea } from '../comment-area/comment-area';
import { MarkdownModule } from 'ngx-markdown';
import { Post } from '../../dto/dto';
import { PostService } from '../../service/post';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { UserHeaderComponent } from "../user-header/user-header";
import { TimeAgoPipe } from '../../pipe/time-ago-pipe';

@Component({
  selector: 'app-post-view',
  imports: [CommentArea, MarkdownModule, UserHeaderComponent,TimeAgoPipe],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss'
})
export class PostView {
  post: Post | null = null;
  loading =false;
  httpPost = inject(PostService)
  private route = inject(ActivatedRoute);
  ngOnInit() {
      this.route.paramMap.pipe(
        tap(() => this.loading = true),
        switchMap(params => {
          const postId = params.get('id');
          if (postId) {
            return this.httpPost.getPostById(postId);
          }
          return new Promise(() => {}); 
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
}
