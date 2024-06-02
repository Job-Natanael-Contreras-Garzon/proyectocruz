import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { Bitacora } from '../interfaces/bitacora';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  nombreAdministrador: string = '';
  telefono: string = '';
  correoElectronico: string = '';

  username: string = '';
  password: string = '';
  loading: boolean = false;

  tipoPermiso: string = '';

  constructor(private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorServices: ErrorService,
    private _bitacoraServices:BitacoraService) {

  }
  
   ngOnInit(): void {
    
  }

  login() {

    // Validamos que el usuario ingrese datos
    if (this.username == '' || this.password == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return
    }

    // Creamos el body
    const user: User = {
      nombreAdministrador: this.nombreAdministrador,
      telefono: this.telefono,
      correoElectronico: this.correoElectronico,
      username: this.username,
      password: this.password,
      tipoPermiso: this.tipoPermiso,
    }

    this.loading = true;
    this._userService.login(user).subscribe({
      next: (token) => {
        localStorage.setItem('token',token)
        this._bitacoraServices.ActualizarBitacora("Inicio de Sesion")
        this.router.navigate(['/home']);
      },
      error: (e: HttpErrorResponse) => {
        this._errorServices.msjError(e);
        this.loading = false;
      } 
    })

  }
 
}
