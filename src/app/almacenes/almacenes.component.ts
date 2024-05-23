import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenServices } from '../../services/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Almacen } from '../interfaces/almacen';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css']
})
export class AlmacenesComponent implements OnInit {
  almacenes: Almacen[] = []; // Aquí almacenaremos los almacenes


  constructor(private fb: FormBuilder,
    private _alamcenServices: AlmacenServices,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
  ) {
    
  }
  ngOnInit(): void {
    this.getListAlmacenes();
  }
  

  getListAlmacenes(){
    this._alamcenServices.getlistAlmacenes().subscribe((data)=>{
      this.almacenes=data;
    })
  }



  deleteAlamcen(id: number){
    this._alamcenServices.deleteAlmacen(id).subscribe(()=>{
      this.getListAlmacenes();
      this.toastr.warning('El Almacen fue eliminado con Exito','Almacen eliminado');
    })
  }

  navegar(){
    this.router.navigate(['/home/addAlma']);
  }
}
