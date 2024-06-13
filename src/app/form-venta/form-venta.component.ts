import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../interfaces/product';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../interfaces/factura';
import { BitacoraService } from '../../services/bitacora.service';
import { DetalleFactura } from '../interfaces/detallefactura';

@Component({
  selector: 'app-form-venta',
  templateUrl: './form-venta.component.html',
  styleUrl: './form-venta.component.css'
})
export class FormVentaComponent implements OnInit{

  CI_Cliente: number = 0;
  nombreCliente: string = "";
  emailCliente: string = "";
  telefonoCliente: string = "";
  metodoPago: string = "";
  username: string = "";
  codfact: number=0;

  listproducts: Product[] = [];
  productoSeleccionado: Product={
    categoria: "",
    marca: "",
    stock:0,
    precio_compra: 0,
    precio_venta:0,
    fecha_vencimiento: new Date
  };
  cantidadSeleccionada: number = 1;
  productosSeleccionados: { producto: Product, cantidad: number, subtotal: number }[] = [];

  constructor(
    private _productServices: ProductoService,
    private toastr: ToastrService,
    private _facturaServices: FacturaService,
    private _bitacoraServices: BitacoraService,
  ){

  }

  ngOnInit(): void {
    this.getListProducto();
    this.getUsernameFromToken();
  }

  getListProducto(){
    this._productServices.getProducts().subscribe((data:Product[])=>{
      this.listproducts=data;
    })
  }

  agregarProducto() {
    if (this.productoSeleccionado && this.cantidadSeleccionada > 0) {
      const encontrado = this.productosSeleccionados.find(item => item.producto === this.productoSeleccionado);
      if (encontrado) {
        encontrado.cantidad += this.cantidadSeleccionada;
        encontrado.subtotal += this.productoSeleccionado.precio_venta * this.cantidadSeleccionada;
      } else {
        const subtotal = this.productoSeleccionado.precio_venta * this.cantidadSeleccionada;
        this.productosSeleccionados.push({
          producto: this.productoSeleccionado,
          cantidad: this.cantidadSeleccionada,
          subtotal: subtotal
        });
      }
    }
  }
  

  eliminarProducto(producto: { producto: Product, cantidad: number, subtotal: number }) {
    const index = this.productosSeleccionados.indexOf(producto);
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
    }
  }

  calcularTotal() {
    let total = 0;
    this.productosSeleccionados.forEach(item => {
      total += item.subtotal;
    });
    return total;
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token'); // Obtén el token JWT almacenado en el localStorage
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); // Decodifica la parte del payload
        this.username = payload.username; 
       
      } else {
        this.toastr.error('El token no tiene el formato esperado.','Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.','Error');
    }
  }

  
  EsFactura():boolean{
    return this.CI_Cliente!=0 && this.CI_Cliente!=undefined && this.CI_Cliente!=null;
  }


  ConfirmarVenta(){
    const factura: Factura={
      ci_cliente:this.CI_Cliente,
      nombre_cliente:this.nombreCliente,
      correo_cliente: this.emailCliente,
      telefono_cliente: this.telefonoCliente,
      nombre_usuario: this.username,
      metodo_pago_nombre:this.metodoPago,
    }
    
      this._facturaServices.newFactura(factura).subscribe((data:any)=>{
        const codFactura = data[0].insertar_factura;
          this.codfact = codFactura;    
          this.detalleFact();
          this.toastr.success('Factura Añadida con Exito','Factura Añadida')  
          this._bitacoraServices.ActualizarBitacora(`Creó la factura del cliente ${this.nombreCliente}`)
        })
       
  }

  detalleFact(){
    this.productosSeleccionados.forEach(item => {
        
      const detalleFac: DetalleFactura = {
        codigo_factura: this.codfact,
        categoria_producto_nombre: `${item.producto.categoria}`,
        cantidad_producto: item.cantidad
      };

      // Guardar el detalle de la factura
      this._facturaServices.newDetalleFactura(detalleFac).subscribe(() => {
      });

    })
  }

}
