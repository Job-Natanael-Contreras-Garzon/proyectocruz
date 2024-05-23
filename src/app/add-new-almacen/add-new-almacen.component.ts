import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenServices } from '../../services/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Almacen } from '../interfaces/almacen';

@Component({
  selector: 'app-add-new-almacen',
  templateUrl: './add-new-almacen.component.html',
  styleUrl: './add-new-almacen.component.css'
})
export class AddNewAlmacenComponent implements OnInit{
  

  almacenes: Almacen[] = []; // Aquí almacenaremos los almacenes
  AlmacenForm: FormGroup;
  id:number;
  operacion:string = 'Agregar ';

  constructor(private fb: FormBuilder,
    private _almacenServices: AlmacenServices,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
  ){
    this.AlmacenForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      capacidad_actual: ['', Validators.required],
      capacidad_total: ['', Validators.required]
    });

    this.id = Number(this.aRouter.snapshot.paramMap.get('id'));
    //console.log(this.id);
    
  }
  
  ngOnInit(): void {
    if(this.id!=0){
      this.operacion='Modificar';
      this.getAlmacen(this.id);
    }
  }


  newAlmacen(){
    const almacenData = this.AlmacenForm.getRawValue();
    const almacen:Almacen = {
      nombre: almacenData.nombre, 
      direccion: almacenData.direccion,
      ciudad: almacenData.ciudad,
      capacidad_actual: almacenData.capacidad_actual,
      capacidad_total: almacenData.capacidad_total
    }

    if(this.id!=0){
      //modificar
      almacen.id=this.id;
      this._almacenServices.UpdateAlmacen(this.id,almacen).subscribe(()=>{
        this.toastr.success(`El Proveedor ${almacenData.nombre} fue actualizado con exito`,'Almacen Actualizado'); 
        this.router.navigate(['home/almacen']);
      })
    }else{
      //agregar
      this._almacenServices.newAlmacen(almacen).subscribe(()=>{
        this.toastr.success(`El Proveedor ${almacenData.nombre} fue registrado con exito`,'Almacen Registrado');
        this.router.navigate(['home/almacen']);
      })
    }
    

  }

  getAlmacen(id:number){
    this._almacenServices.getAlmacen(id).subscribe((data:Almacen)=>{
      //console.log(data);
      this.AlmacenForm = this.fb.group({
        nombre: [data.nombre],
        direccion: [data.direccion],
        ciudad: [data.ciudad],
        capacidad_actual: [data.capacidad_actual],
        capacidad_total: [data.capacidad_total]
      });
    })
  }

  navegar(){
    this.router.navigate(['/home/almacen']);
  }
}
