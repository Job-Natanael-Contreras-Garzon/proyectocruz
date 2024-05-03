import { Component } from '@angular/core';

interface Proveedor {
  nombre: string;
  direccion: string;
  telefono: string;
  selected?: boolean;
}

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent {
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  proveedores: Proveedor[] = [];

  validarYAgregarProveedor(): void {
    if (this.nombre && this.direccion && this.telefono) {
      this.proveedores.push({
        nombre: this.nombre,
        direccion: this.direccion,
        telefono: this.telefono
      });
      this.nombre = '';
      this.direccion = '';
      this.telefono = '';
    } else {
      alert("Por favor, complete todos los campos.");
    }
  }

  eliminarProveedor(): void {
    this.proveedores = this.proveedores.filter(proveedor => !proveedor.selected);
  }

  modificarProveedor(): void {
    const seleccionados = this.proveedores.filter(proveedor => proveedor.selected);
    if (seleccionados.length !== 1) {
      alert("Por favor, seleccione solo un proveedor para modificar.");
      return;
    }
    const seleccionado = seleccionados[0];
    this.nombre = seleccionado.nombre;
    this.direccion = seleccionado.direccion;
    this.telefono = seleccionado.telefono;
    this.proveedores = this.proveedores.filter(proveedor => !proveedor.selected);
  }
}

