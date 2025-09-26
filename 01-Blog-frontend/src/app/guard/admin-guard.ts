import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../service/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  auth = inject(Auth)
  constructor(private router: Router) { }

  canActivate(): boolean {
    let isAdmin = false;
    this.auth.checkAdmin().subscribe({
      next: (r) => { isAdmin = r },
      error: () => { }
    });
    if (!isAdmin) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
