import { Component, OnInit } from '@angular/core';
import { PermisosService } from '../../services/permisos.service';
import { NotaSalidaService } from '../../services/nota-salida.service';
import { ToastrService } from 'ngx-toastr';
import { NotaSalida } from '../interfaces/nota_salida';

@Component({
  selector: 'app-nota-salida',
  templateUrl: './nota-salida.component.html',
  styleUrl: './nota-salida.component.css'
})
export class NotaSalidaComponent implements OnInit{
  permiso:string | undefined;
  listNotaSalidas: NotaSalida[]=[]

  constructor(
    private _permiso:PermisosService,
    private _notaSalidaServices: NotaSalidaService,
    private toastr:ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getListNotasSalida();
    this._permiso.obtenerPermisos();
    this._permiso.perm$.subscribe((permiso: string | undefined) => {
      this.permiso = permiso;
    });
  }

  getListNotasSalida(){
    this._notaSalidaServices.getNotasSalida().subscribe((date: NotaSalida[])=>{
      this.listNotaSalidas=date
    })
  }

  deleteNotaSalida(cod: number){
    this._notaSalidaServices.deleteNotaSalida(cod).subscribe(()=>{
      this.toastr.warning("Nota de salida Eliminada con exito","Nota de Salida Eliminada");
      this.getListNotasSalida();
    })
  }

}
