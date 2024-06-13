import { Component, OnInit } from '@angular/core';
import { PermisosService } from '../../services/permisos.service';
import { NotaSalidaService } from '../../services/nota-salida.service';
import { ToastrService } from 'ngx-toastr';
import { NotaSalida } from '../interfaces/nota_salida';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-nota-salida',
  templateUrl: './nota-salida.component.html',
  styleUrl: './nota-salida.component.css'
})
export class NotaSalidaComponent implements OnInit{
  listNotaSalidas: NotaSalida[]=[]
  username: string = "";
  insertar: boolean = false;
  eliminar: boolean = false;

  constructor(
    private _permisoServices:PermisosService,
    private _notaSalidaServices: NotaSalidaService,
    private _bitacoraServices: BitacoraService,
    private toastr:ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getListNotasSalida();
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos(){
    this._permisoServices.getPermiso(this.username,"notasalida").subscribe((data: Permiso[])=>{
      data.forEach((perm: Permiso)=>{
        this.insertar = perm.perm_insertar;
        this.eliminar = perm.perm_eliminar;
      })
    })
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

  getListNotasSalida(){
    this._notaSalidaServices.getNotasSalida().subscribe((date: NotaSalida[])=>{
      this.listNotaSalidas=date
    })
  }

  deleteNotaSalida(cod: number,origen: string){
    this._notaSalidaServices.deleteNotaSalida(cod).subscribe(()=>{
      this.toastr.warning(`Nota de salida con origen: ${origen} Eliminada con exito`,"Nota de Salida Eliminada");
      this._bitacoraServices.ActualizarBitacora(`Elimino la nota de salida de origen: ${origen}`);
      this.getListNotasSalida();
    })
  }

}
