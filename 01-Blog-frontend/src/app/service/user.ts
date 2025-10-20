import { Injectable, signal } from '@angular/core';
import { User } from '../dto/dto';

@Injectable({ providedIn: 'root' })
export class UserStore {
  user = signal<User | null>(null);
  setUser(u: User) {
    this.user.set(u);
  }
  get getUser() {
    return this.user();
  }
  clearUser() {
    this.user.set(null);
  }
}