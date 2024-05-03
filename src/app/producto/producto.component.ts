// producto.component.ts
import { Component } from '@angular/core';

interface Producto {
  categoria: string;
  marca: string;
  stock: number;
  precioCompra: number;
  fechaVencimiento: string;
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  producto: Producto = {
    categoria: '',
    marca: '',
    stock: 0,
    precioCompra: 0,
    fechaVencimiento: ''
  };
  productos: Producto[] = [];
  categorias: string[] = ['Seleccionar Categoria', 'capuchon_de_triceta', 'electronica', 'ropa'];
  marcas: string[] = ['Seleccionar Marca', 'Golden', 'NISSAN'];

  registrarProducto(): void {
    if (this.productoValido()) {
      this.productos.push({...this.producto});
      this.resetFormulario();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  }

  productoValido(): boolean {
    return this.producto.categoria !== '' && this.producto.marca !== '' && this.producto.stock > 0 && this.producto.precioCompra > 0;
  }
  

  resetFormulario(): void {
    this.producto = {
      categoria: '',
      marca: '',
      stock: 0,
      precioCompra: 0,
      fechaVencimiento: ''
    };
  }
}
