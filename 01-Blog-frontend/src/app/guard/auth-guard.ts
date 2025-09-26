import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../service/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth = inject(Auth)
  constructor(private router: Router) { }

  canActivate(): boolean {
    let isLoggedIn = false;
    this.auth.checkAuth().subscribe({
      next: (data) => { isLoggedIn = data },
      error: () => { }
    });
    console.log(isLoggedIn)
    if (!isLoggedIn) {

      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
