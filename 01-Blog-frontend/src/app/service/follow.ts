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
    return this.http.post(this.API + uid, {});
  }
}
