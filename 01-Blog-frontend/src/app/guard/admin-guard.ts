import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../service/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  auth = inject(Auth)
  constructor(private router: Router) { }

  async canActivate(): Promise<boolean> {
    try {
      let isAdmin = await firstValueFrom(this.auth.checkAdmin());
      if (!isAdmin) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
