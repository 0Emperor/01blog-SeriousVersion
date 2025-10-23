import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProfileDto, User } from '../dto/dto';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  http = inject(HttpClient);
  readonly API = 'http://localhost:8080/api/profile';

  getProfile(username: string) {
    return this.http.get<ProfileDto>(`${this.API}/${username}`);
  }

  updateProfile(username?: string, bio?: string, file?: File) {
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (bio) formData.append('bio', bio);
    if (file) formData.append('profile', file);

    return this.http.put<{user:User,jwt:string}>(`${this.API}/me`, formData);
  }
}
