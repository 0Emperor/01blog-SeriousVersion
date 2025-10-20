import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  static baseApi = "http://localhost:8080/auth"
  static accessApi = "http://localhost:8080/access"
  static adminApi = Auth.accessApi + "/admin"
  static loginApi = Auth.baseApi + "/login"
  static registerApi = Auth.baseApi + "/register"
  http = inject(HttpClient);
  login(name: string, password: string) {
    return this.http.post(Auth.loginApi, { username: name, password: password });
  }
  register(name: string, password: string) {
    return this.http.post(Auth.registerApi, { username: name, password: password });
  }
  checkAuth() {
    return this.http.get<boolean>(Auth.accessApi)
  }
  checkAdmin() {
    return this.http.get<boolean>(Auth.adminApi)
  }
  checkIsOwnPost(pId: string){
    // return this.http.get()
  }
}
