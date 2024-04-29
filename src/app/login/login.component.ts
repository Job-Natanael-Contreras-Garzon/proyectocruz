import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public disabled: boolean = false;
  public loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get passwordValid(): boolean {
    return this.loginForm.get('password')?.valid || false;
  }

  login(username: string, password: string): void {
    this.http.post('/api/login', { username, password }).subscribe((response) => {
      // Manejar la respuesta del servidor
    }, (error) => {
      console.error('Error en la autenticación:', error);
    });
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ){}
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.disabled = true;
    
    this.router.navigate(['/home']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.onLogin();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}