import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../dto/dto';
import { Observable } from 'rxjs';

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
  getCommentsPerPost(page: number, limit: number = 10, id: string): Observable<any> {
    const springPage = page - 1;
    const url = `${this.api}/${id}?page=${springPage}&size=${limit}`;
    return this.http.get<any>(url);
  }

}
