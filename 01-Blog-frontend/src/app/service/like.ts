import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Like {
  likeApi = "http://localhost:8080/api/like/"
  http = inject(HttpClient);
  aply(pID: string, isLiked: boolean) {
    return isLiked ? this.unLike(pID) : this.like(pID);
  }
  like(pId: string) {
    return this.http.post<boolean>(this.likeApi + pId, {});
  }
  unLike(pId: string) {
    return this.http.delete<boolean>(this.likeApi + pId);
  }
}
