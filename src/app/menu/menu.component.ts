import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../interfaces/user';
import { PermisosService } from '../../services/permisos.service';
import { BitacoraService } from '../../services/bitacora.service';
import { Bitacora } from '../interfaces/bitacora';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  public AlmacenForm: FormGroup = this.fb.group({
    
  });

  private token: string;
  perm: string | undefined;
  username:string = '';


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _userService: UserService,
    private toastr: ToastrService,
    private _permiso:PermisosService,
    private _bitacoraServices:BitacoraService
  ){
    this.token = localStorage.getItem('token')|| '';
    if(this.token===''){
      this.toastr.error('Acceso denegado', 'Error');
      router.navigate(['/login'])
      return;
    }
    this.getUsernameFromToken();
    this._permiso.obtenerPermisos();
    this._permiso.perm$.subscribe((permiso: string | undefined) => {
      this.perm = permiso;
    });

    this.getUsernameFromToken();
  }
  
  

  getUsernameFromToken() {
    const token = localStorage.getItem('token'); // Obtén el token JWT almacenado en el localStorage
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); // Decodifica la parte del payload
        this.username = payload.username; 
       
      } else {
        this.toastr.error('El token no tiene el formato esperado.','Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.','Error');
    }
  }


  //haciendo procedimiento que lleva a la ruta establecida
  onAlmacen(): void {
    this.router.navigate(['/Almacen']); // Corregido a '/Almacen'
  }

  almacen(){
    this.router.navigate(['/home/almacen']);
  }

  proveedores(){
    this.router.navigate(['/home/proveedores']);
  }

  producto(){
    this.router.navigate(['/home/productos']);
  }

  vender(){
    this.router.navigate(['/home/vender']);
  }

  home(){
    this.router.navigate(['/home']);
  }

  registro(){
    this.router.navigate(['/home/registro']);
  }
  
  cambiar_password(){
    this.router.navigate(['/home/newPassword']);
  }

  logOut(){
    this._bitacoraServices.ActualizarBitacora("Cerro Sesion")
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  bitacora(){
    this.router.navigate(['/home/bitacora']);
  }

}
