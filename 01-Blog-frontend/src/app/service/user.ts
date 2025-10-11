import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStore {
  user = signal<{ username: string; profile?: string; role: String } | null>(null);

  setUser(u: any) {
    this.user.set(u);
  }

  clearUser() {
    this.user.set(null);
  }
}