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
  register(username: string, password: string, bio?: string, name?: string, file?: File) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (bio) formData.append('bio', bio);
    if (file) formData.append('profile', file);
    if (name) formData.append('name', name)

    return this.http.post(Auth.registerApi, formData);
  }
  login(name: string, password: string) {
    return this.http.post(Auth.loginApi, { username: name, password: password });
  }
  checkAuth() {
    return this.http.get<boolean>(Auth.accessApi)
  }
  checkAdmin() {
    return this.http.get<boolean>(Auth.adminApi)
  }
}
