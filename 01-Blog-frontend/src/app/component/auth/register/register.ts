import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../service/auth';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true, 
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatButtonModule
  ]
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
        this.router.navigate(['/home']);
      })
  }
}
