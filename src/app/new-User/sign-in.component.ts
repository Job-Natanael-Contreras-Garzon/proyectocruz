import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  nombre: string = '';
  telefono: string = '';
  email: string = '';
  permisos: string = '';

  username: string = '';
  password: string = '';
  confirm_password = '';

  constructor(private toastr: ToastrService,
    private _userServices: UserService,
    private router: Router,
    private _errorServices: ErrorService,
    private _bitacoraServices:BitacoraService
  ){}


  addUser(){
    //validar campos}
    if(this.nombre == '' || this.telefono == '' || this.email == '' || this.permisos == '' || this.username == ''||
      this.password == '' || this.confirm_password == ''){
        this.toastr.error('Todos los campos son obligatorios','Error');
        return;
      } 

      //validamos si las password son correctas 
    if(this.password != this.confirm_password){
      this.toastr.error('Las password ingresadas son distintas','Error');
        return;
    }

    const user: User = {
      nombreAdministrador: this.nombre,
      telefono: this.telefono,
      correoElectronico: this.email,
      username: this.username,
      password: this.password,
      tipoPermiso: this.permisos,
    }

    this._userServices.newUser(user).subscribe(
      (data: any) => {
        // Manejar la respuesta exitosa aquí
        localStorage.setItem('token', data.token);
        this.toastr.success('Usuario Creado con exito','Usuario Creado')
        this.limpiarCampos();
      },
      (error: HttpErrorResponse) => {
        // Manejar el error aquí
        this._errorServices.msjError(error);
      } 
    );
    this._bitacoraServices.ActualizarBitacora("Creó un Nuevo Usuario");
  }

  limpiarCampos() {
    this.nombre = '';
    this.telefono = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.confirm_password = '';
    this.permisos = '';
  }

  
  ngOnInit(): void {
    
  }

}
