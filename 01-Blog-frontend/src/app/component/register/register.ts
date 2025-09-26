import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  constructor(private router: Router) { }
  auth = inject(Auth)
  username = signal("")
  password = signal("")
  register = () => {
    this.auth.register(this.username(), this.password())
      .pipe(catchError((e) => {
        throw e
      }))
      .subscribe((e: any) => {
        window.localStorage.setItem("jwt", e["jwt"]);
        this.router.navigate(['/']);
      })
  }
}
