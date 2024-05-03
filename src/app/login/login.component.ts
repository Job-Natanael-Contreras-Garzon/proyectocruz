import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm: FormGroup;
  public errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.login(username, password);
    } else {
      this.errorMessage = 'Por favor, complete todos los campos.';
    }
  }

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe(
      (response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Autenticación fallida.';
        }
      },
      (error) => {
        console.error('Error en la autenticación:', error);
        this.errorMessage = 'Error en la autenticación. Por favor, inténtalo de nuevo más tarde.';
      }
    );
  }
}
