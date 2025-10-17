import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment} from '../dto/dto';

@Injectable({
  providedIn: 'root'
})
export class CommentS {
  http = inject(HttpClient)
  api = "http://localhost:8080/api/comment"
  addComment(content: string, id: string) {
    return this.http.post<Comment>(this.api, {
      content: content,
      pid: id
    });
  }
}
