import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Follow {
  http = inject(HttpClient)
  readonly API = "http://localhost:8080/api/follow/"
  follow(uid: string) {
    return this.http.post(this.API + uid, {});
  }
  unfollow(uid: string) {
    return this.http.delete(this.API + uid, {});
  }

  getFollowing(username: string, page: number = 0, size: number = 20, query: string = '') {
    return this.http.get<any>(`http://localhost:8080/api/v1/users/${username}/following?page=${page}&size=${size}&query=${query}`);
  }

  getFollowers(username: string, page: number = 0, size: number = 20, query: string = '') {
    return this.http.get<any>(`http://localhost:8080/api/v1/users/${username}/followers?page=${page}&size=${size}&query=${query}`);
  }
}
