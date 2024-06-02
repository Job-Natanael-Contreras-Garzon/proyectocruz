import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../services/proveedores.service';
import { Proveedores } from '../interfaces/proveedores';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BitacoraService } from '../../services/bitacora.service';



@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit{


  constructor(private _proveedorServices: ProveedoresService,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private _bitacoraServices:BitacoraService
  ){
    //console.log(aRouter.snapshot.paramMap.get('codigo'));
    
  }

  ngOnInit(): void {
    this.getListProveeedores();
  }

  getListProveeedores(){
    this._proveedorServices.getlistProveedores().subscribe((data)=>{
      this.proveedores=data;
    })
  }



  
  proveedores: Proveedores[] = [];

  deleteProveedor(codigo: number){
    this._proveedorServices.deleteProveedor(codigo).subscribe(()=>{
      this.getListProveeedores();
      this.toastr.warning('El Proveedor fue eliminado con Exito','Proveedor eliminado');
      this._bitacoraServices.ActualizarBitacora("Elimino un Proveedor");
    })
  }

  navegar(){
    this.router.navigate(['/home/add']);
  }

  modificarProveedor(): void {
    
  }
}

