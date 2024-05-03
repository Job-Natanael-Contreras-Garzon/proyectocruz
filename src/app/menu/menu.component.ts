import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  public AlmacenForm: FormGroup = this.fb.group({
    
  });
  constructor(
    private router: Router,
    private fb: FormBuilder
  ){}
  //haciendo procedimiento que lleva a la ruta establecida
  onAlmacen(): void {
    this.router.navigate(['/Almacen']); // Corregido a '/Almacen'
  }
}
