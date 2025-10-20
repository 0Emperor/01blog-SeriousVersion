import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../service/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {
  auth = inject(Auth)
  constructor(private router: Router) { }

  async canActivate(): Promise<boolean> {
    try {
      let isLoggedIn = await firstValueFrom(this.auth.checkAuth());
      if (!isLoggedIn) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    } catch (e) {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
