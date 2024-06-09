import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { PermisosService } from '../../services/permisos.service';
import { FacturaService } from '../../services/factura.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit{
  permiso:string | undefined;

  listfactura: Factura[]=[];

  constructor (
    private _permiso:PermisosService,
    private _facturaServices:FacturaService,
    private toastr:ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getListFactura();
    this._permiso.obtenerPermisos();
    this._permiso.perm$.subscribe((permiso: string | undefined) => {
      this.permiso = permiso;
    });
  }

  getListFactura(){
    this._facturaServices.MostrarFacturas().subscribe((data:Factura[])=>{
      this.listfactura=data;
    });
  }

  deleteFactura(cod:number){
    this._facturaServices.delete_Factura_Detalle(cod).subscribe(()=>{
      this.toastr.warning('Factura Eliminada con Existo',"Factura Eliminada");
      this.getListFactura();
    })
  }
  
}



