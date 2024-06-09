import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { DetalleFactura } from '../interfaces/detallefactura';
import { FacturaService } from '../../services/factura.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent implements OnInit {
  nombre_administrador:string = "";
  nombre_cliente: string="Juan Perez";
  metodo_pago: string="QR";
  fecha: Date=new Date;
  total: number=0;

  codigo:number;

    listdetallefactura: DetalleFactura[]=[];


  ngOnInit(): void {
    this.getListaFac();
    this.getListadetalleFac();
  }
    

  constructor(
    private _facturaServices: FacturaService,
    private toastr :ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
  ){
    this.codigo = Number(this.aRouter.snapshot.paramMap.get('codigo'));
  }

  getListaFac() {
    this._facturaServices.getFactura(this.codigo).subscribe((data: Factura[]) => {
      if (data.length > 0) {
        const factura = data[0];
        this.nombre_cliente = factura.nombre_cliente;
        this.metodo_pago = factura.metodo_pago_nombre;
        this.nombre_administrador = factura.nombre_usuario
        this.fecha = factura.fecha!;
        this.total = factura.total!;
      } else {
        console.log("No se encontraron facturas.");
      }
    });
  }
  
  getListadetalleFac(){
    this._facturaServices.getDetallesFactura(this.codigo).subscribe((data: DetalleFactura[])=>{
      this.listdetallefactura=data;
    })
  }



}
