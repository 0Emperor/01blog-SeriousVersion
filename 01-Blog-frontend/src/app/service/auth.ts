import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  static baseApi = environment.apiUrl + "/auth"
  static accessApi = environment.apiUrl + "/access"
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
    return this.http.get<boolean>(Auth.accessApi).pipe(
      catchError((error: HttpErrorResponse) => {
        // Suppress 403/401 errors by returning false (not authenticated/authorized)
        if (error.status === 403 || error.status === 401) {
          return of(false);
        }
        // Re-throw other errors
        throw error;
      })
    );
  }
  checkAdmin() {
    return this.http.get<boolean>(Auth.adminApi).pipe(
      catchError((error: HttpErrorResponse) => {
        // Suppress 403/401 errors by returning false (not admin)
        if (error.status === 403 || error.status === 401) {
          return of(false);
        }
        // Re-throw other errors
        throw error;
      })
    );
  }
}
