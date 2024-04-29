import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  public disabled: boolean = false;
  public loginForm: FormGroup = this.fb.group({
    email: ['', ],
    password: ['', ],
  });

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
    private fb:FormBuilder,
  ){}
  onLogin(){
    this.disabled = true;
    //this.router.navigate(['/']);
    this.router.navigate(['/Vender']);
   
  }
}
