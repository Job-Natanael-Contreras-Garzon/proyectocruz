import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css']
})
export class AlmacenesComponent {
  almacenes: any[] = []; // Aquí almacenaremos los almacenes
  AlmacenForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Puedes inicializar los almacenes aquí si lo deseas
    this.almacenes.push({ nombre: 'Almacén A', direccion: 'Dirección A', ciudad: 'Ciudad A', capacidad_actual: 50, capacidad_total: 100 });

    // Inicializar el formulario
    this.AlmacenForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      capacidad_actual: ['', Validators.required],
      capacidad_total: ['', Validators.required]
    });
  }

  registrarAlmacen() {
    if (this.AlmacenForm.valid) {
      // Agregar el nuevo almacén al arreglo de almacenes
      this.almacenes.push(this.AlmacenForm.value);

      // Limpiar los campos del formulario después de registrar
      this.AlmacenForm.reset();
    }
  }

  editarAlmacen(almacen: any) {
    
    alert("Función de editar almacén aún no implementada");
  }

  eliminarAlmacen(almacen: any) {
    // Eliminar el almacén del arreglo de almacenes
    const index = this.almacenes.indexOf(almacen);
    if (index !== -1) {
      this.almacenes.splice(index, 1);
    }
  }
}
