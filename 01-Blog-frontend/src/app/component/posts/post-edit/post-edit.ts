import { Component, inject } from '@angular/core';
import { PostService } from '../../../service/post';
import { Post } from '../../../dto/dto';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { PostCompose } from "../post-compose/post-compose";

@Component({
  selector: 'app-post-edit',
  imports: [PostCompose],
  templateUrl: './post-edit.html',
  styleUrl: './post-edit.scss'
})
export class PostEdit {
  postService = inject(PostService)
  Post: Post | null = null;
  route = inject(ActivatedRoute)
  router = inject(Router)
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const postId = params.get('id');
        if (postId) {
          return this.postService.getPostToEdit(postId);
        }
        return new Promise(() => { });
      })
    ).subscribe({
      next: (data: Post) => {
        this.Post = data;        
      },
      error: (err) => {
        this.router.navigate(["home"])
      }
    });
  }
}
