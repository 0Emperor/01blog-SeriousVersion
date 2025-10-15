import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../service/auth';
import { Router, RouterLink } from '@angular/router';
import { catchError } from 'rxjs';

// Import FormsModule and Material modules
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true, 
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatButtonModule
  ]
})
export class Login {
  constructor(private router: Router) { }
  auth = inject(Auth)
  username = signal("")
  password = signal("")
  login = () => {
    this.auth.login(this.username(), this.password())
      .pipe(catchError((e) => { throw e }))
      .subscribe((e: any) => {
        window.localStorage.setItem("jwt", e["jwt"]);
        this.router.navigate(['/home']);
      })
  }
}
