import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  public AlmacenForm: FormGroup = this.fb.group({
    
  });

  private token: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ){
    this.token = localStorage.getItem('token')|| '';
    if(this.token===''){
      this.toastr.error('Acceso denegado', 'Error');
      router.navigate(['/login'])
      return;
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
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
