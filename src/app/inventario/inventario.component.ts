import { Component, OnInit } from '@angular/core';
import { Inventario } from '../interfaces/inventario';
import { InventarioService } from '../../services/inventario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{
  listInventario: Inventario[]=[]
  constructor(
    private _inventarioServices: InventarioService,
    private toastr :ToastrService,
  ){

  }

  ngOnInit(): void {
    this.getListInventario();
  }

  getListInventario(){
    this._inventarioServices.getInventarios().subscribe((data:Inventario[])=>{
      this.listInventario=data;
    })
  }

  deleteInventario(cod:number){
    this._inventarioServices.deleteInventarios(cod).subscribe(()=>{
      this.toastr.warning("Inventario Eliminado con Exito","Inventario Eliminado");
      this.getListInventario();
    })
  }

}
