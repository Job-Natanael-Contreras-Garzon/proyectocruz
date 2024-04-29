import { Component } from '@angular/core';

interface Producto {
    producto: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent {
  productos: Producto[] = [];

  ngOnInit() {
    this.mostrarProductosEnTabla();
  }

  agregarProducto(productoSeleccionado: any) {
    productoSeleccionado = document.getElementById('producto') as HTMLSelectElement;
    const cantidad = parseInt((document.getElementById('cantidad') as HTMLInputElement).value);

    if (productoSeleccionado.value && cantidad) {
        const producto = productoSeleccionado.options[productoSeleccionado.selectedIndex].text;
        const precio = parseFloat(producto.split(' - ')[1].replace('$', ''));
        const subtotal = cantidad * precio;

        let productoExistenteIndex = -1;
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].producto === producto) {
                productoExistenteIndex = i;
                break;
            }
        }

        if (productoExistenteIndex !== -1) {
            this.productos[productoExistenteIndex].cantidad += cantidad;
            this.productos[productoExistenteIndex].subtotal += subtotal;
        } else {
            this.productos.push({
                producto: producto,
                cantidad: cantidad,
                precio: precio,
                subtotal: subtotal
            });
        }

        this.mostrarProductosEnTabla();
        this.actualizarTotal(subtotal);
    }
  }

  mostrarProductosEnTabla() {
    const tablaBody = document.querySelector('#productosSeleccionados tbody');
    if (tablaBody) {
      tablaBody.innerHTML = '';

      this.productos.forEach((producto, index) => {
        const fila = document.createElement('tr');

        const celdaEliminar = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'eliminar';
        checkbox.value = index.toString();
        celdaEliminar.appendChild(checkbox);
        fila.appendChild(celdaEliminar);

        const celdaProducto = document.createElement('td');
        celdaProducto.textContent = producto.producto;
        fila.appendChild(celdaProducto);

        const celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = producto.cantidad.toString();
        fila.appendChild(celdaCantidad);

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = producto.precio.toFixed(2);
        fila.appendChild(celdaPrecio);

        const celdaSubtotal = document.createElement('td');
        celdaSubtotal.textContent = producto.subtotal.toFixed(2);
        fila.appendChild(celdaSubtotal);

        tablaBody.appendChild(fila);
      });
    }

      
  }

  actualizarTotal(subtotal: number) {
    const totalElement = document.getElementById('total') as HTMLTableCellElement | null;
    if (totalElement !== null && totalElement.textContent !== null) {
        let total = parseFloat(totalElement.textContent);
        total += subtotal;
        totalElement.textContent = total.toFixed(2);
    } else {
        console.error('No se encontró el elemento #total o su contenido es nulo');
    }
}

  eliminarProductos() {
    const checkboxes = document.querySelectorAll('input[name="eliminar"]:checked') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.value);
        const subtotal = this.productos[index].subtotal;
        this.productos.splice(index, 1);
        this.actualizarTotal(-subtotal);
    });
    this.mostrarProductosEnTabla();
}
}



