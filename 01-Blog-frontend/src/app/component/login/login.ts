import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../service/auth';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private router: Router) { }
  auth = inject(Auth)
  username = signal("")
  password = signal("")
  login = () => {
    this.auth.login(this.username(), this.password())
      .pipe(catchError((e) => {
        throw e
      }))
      .subscribe((e: any) => {
        window.localStorage.setItem("jwt", e["jwt"]);
        this.router.navigate(['/']);
      })
  }
}
