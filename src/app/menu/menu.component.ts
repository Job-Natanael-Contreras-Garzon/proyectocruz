import { Component, OnInit } from '@angular/core';
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
import { Permiso } from '../interfaces/permiso';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  
  public AlmacenForm: FormGroup = this.fb.group({
    
  });
  listvistas: string[]=["vender","producto","proveedor","notasalida","bitacora","usuario"];
  ver_vender: boolean=false;
  ver_producto: boolean=false;
  ver_proveedor: boolean=false;
  ver_notasalida: boolean=false;
  ver_bitacora: boolean=false;
  ver_usuarios: boolean=false;

  private token: string;
  perm: string | undefined;
  username:string = '';
  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _userService: UserService,
    private toastr: ToastrService,
    private _permisoServices:PermisosService,
    private _bitacoraServices:BitacoraService
  ){
    this.token = localStorage.getItem('token')|| '';
    if(this.token===''){
      this.toastr.error('Acceso denegado', 'Error');
      router.navigate(['/login'])
      return;
    }
  }
  ngOnInit(): void {
    this.getUsernameFromToken();
    this.getPerVista();
  }
  
  
  getPerVista() {
    this.listvistas.forEach((vista: string) => {
      this._permisoServices.getPermiso(this.username, vista).subscribe((data: Permiso[]) => {
        data.forEach((permiso: Permiso) => {
          switch (vista) {
            case 'vender':
              this.ver_vender = permiso.perm_ver;
              break;
            case 'producto':
              this.ver_producto = permiso.perm_ver;
              break;
            case 'proveedor':
              this.ver_proveedor = permiso.perm_ver;
              break;
            case 'notasalida':
              this.ver_notasalida = permiso.perm_ver;
              break;
            case 'bitacora':
              this.ver_bitacora = permiso.perm_ver;
              break;
            case 'usuario':
              this.ver_usuarios = permiso.perm_ver;
              break;
            default:
              console.error(`Vista desconocida: ${permiso.vista}`);
          }
        });
      });
    });
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

  NotaSalida(){
    this.router.navigate(['/home/notasalida']);
  }

}
