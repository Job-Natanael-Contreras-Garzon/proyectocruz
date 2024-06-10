import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { NotaSalidaService } from '../../services/nota-salida.service';
import { NotaSalida } from '../interfaces/nota_salida';
import { DetalleNotaSalida } from '../interfaces/detalle_nota_salida';
import { BitacoraService } from '../../services/bitacora.service';


@Component({
  selector: 'app-upd-new-nota-salida',
  templateUrl: './upd-new-nota-salida.component.html',
  styleUrl: './upd-new-nota-salida.component.css'
})
export class UpdNewNotaSalidaComponent implements OnInit{
  origen: string = '';
  descripcion: string = '';
  cod_salida: number = 0;

  listproducts: Product[] = [];
  lisNotaSalida: NotaSalida[]=[];
  listDetNosaSalida: DetalleNotaSalida[]=[];

  detallesAEliminar: number[] = [];
  productoEditandoIndex: number = -1;

  productoSeleccionado: Product={
    categoria: "",
    marca: "",
    stock:0,
    precio_compra: 0,
    precio_venta:0,
    fecha_vencimiento: new Date
  };
  cantidadSeleccionada: number = 1;
  productosSeleccionados: { producto: Product, cantidad: number,codDetNS?:number}[] = [];
  i: number = -1;
  cod: number;
  operacion:string = 'Agregar ';
  cod_detalleNotaSalida: number=0;
  constructor(
    private _productServices: ProductoService,
    private router: Router,
    private toastr: ToastrService,
    private _NotaSalidaServices: NotaSalidaService,
    private aRouter: ActivatedRoute,
    private _DetalleSalidaServices: NotaSalidaService,
    private _bitacoraServices:BitacoraService,
  ){
    this.cod = Number(this.aRouter.snapshot.paramMap.get('cod'));
  }
  ngOnInit(): void {
    if(this.cod!=0){
      this.operacion='Modificar';
      this.getListDetalleNotaSalida();
      this.getNotaSalida();
    }
    this.getListProducto();
  }

  agregarProducto() {
    if (this.productoSeleccionado && this.cantidadSeleccionada > 0) {
      if (this.productoEditandoIndex !== -1) {
        this.productosSeleccionados[this.productoEditandoIndex].producto = this.productoSeleccionado;
        this.productosSeleccionados[this.productoEditandoIndex].cantidad = this.cantidadSeleccionada;
        // Resetea el índice de edición
        this.productoEditandoIndex = -1;
      }else{
        const encontrado = this.productosSeleccionados.find(item => item.producto === this.productoSeleccionado);
        if (encontrado) {
          encontrado.cantidad += this.cantidadSeleccionada;
        } else {
          this.productosSeleccionados.push({
            producto: this.productoSeleccionado,
            cantidad: this.cantidadSeleccionada,
          });
        }
      }
    }
  }


  eliminarProducto(producto: { producto: Product, cantidad: number, codDetNS?: number}) {
    const index = this.productosSeleccionados.indexOf(producto);
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
      if (this.cod !== 0 && producto.codDetNS) {
        this.detallesAEliminar.push(producto.codDetNS);
      }
    }
  }
  
  

  getListProducto(){
    this._productServices.getProducts().subscribe((data:Product[])=>{
      this.listproducts=data;
      this.listDetNosaSalida.forEach(detalle => {
        const productoEncontrado = this.listproducts.find(producto => producto.categoria === detalle.nombre_producto);
        if (productoEncontrado) {
          this.productosSeleccionados.push({
            producto: productoEncontrado,
            cantidad: detalle.cantidad,
            codDetNS: detalle.cod_detalle // Suponiendo que hay un campo cod_detalle en DetalleNotaSalida
          });
        }
      });
    })
  }

  getListDetalleNotaSalida(){
    this._DetalleSalidaServices.getDetalleNotaSalida(this.cod).subscribe((data: DetalleNotaSalida[])=>{
      this.listDetNosaSalida=data
    })
  }

  getNotaSalida() {
    this._NotaSalidaServices.getNotaSalida(this.cod).subscribe((data: NotaSalida) => {
      this.origen = data.origen;
      this.descripcion = data.descripcion;
    });
  }

  confirm(){
    const notasalida: NotaSalida = {
      origen:this.origen,
      descripcion: this.descripcion,
      fecha: new Date,
    }
    if(this.cod!=0){
      //eliminar producto si ya confirmó
      if(this.detallesAEliminar.length>0){
        this.detallesAEliminar.forEach(codDetNS => {
          this._DetalleSalidaServices.deleteDetalleNotaSalida(codDetNS).subscribe(() => {
          });
        });
      } 

      this._NotaSalidaServices.UpdateNotaSalida(this.cod,notasalida).subscribe(()=>{
        this.toastr.success(`Nota de salida: ${this.cod} Actualizada con existo`,"Nota de salida Actualizada")
      })
      
     this.detNotaSalida();
    }else{
      this._NotaSalidaServices.newNotaSalida(notasalida).subscribe((data: number)=>{
        this.cod_salida=data;
        this.detNotaSalida()
        this.toastr.success("Nota de salida creada con existo","Nota de salida Creada")
      })
    }
    this.router.navigate(['/home/notasalida']);
  }

  

  detNotaSalida() {
    if (this.cod != 0) {
      this.productosSeleccionados.forEach(item => {
        if (item.codDetNS) {
          // Este producto ya existe en la nota de salida, actualiza sus detalles
          const detNotaSalida: DetalleNotaSalida = {
            cod_detalle: item.codDetNS,
            nombre_producto: item.producto.categoria,
            cantidad: item.cantidad
          };
          this._DetalleSalidaServices.updateDetalleNotaSalida(detNotaSalida).subscribe(() => {
            // Actualización exitosa
          }, error => {
            this.toastr.error('Error al actualizar detalle de nota de salida:', error);
          });
        } else {
          // Este producto es nuevo, agrégalo a la nota de salida
          const detNotaSalida: DetalleNotaSalida = {
            cod_salida: this.cod_salida,
            nombre_producto: item.producto.categoria,
            cantidad: item.cantidad
          };
          this._DetalleSalidaServices.newDetalleNotaSalida(detNotaSalida).subscribe(() => {
            // Nuevo detalle agregado
          }, error => {
            this.toastr.error('Error al agregar nuevo detalle de nota de salida:', error);
          });
        }
      });
    } else {
      // Estás creando una nueva nota de salida, agrega todos los productos
      this.productosSeleccionados.forEach(item => {
        const detNotaSalida: DetalleNotaSalida = {
          cod_salida: this.cod_salida,
          nombre_producto: item.producto.categoria,
          cantidad: item.cantidad
        };
        this._DetalleSalidaServices.newDetalleNotaSalida(detNotaSalida).subscribe(() => {
          // Nuevo detalle agregado
        }, error => {
          this.toastr.error('Error al agregar nuevo detalle de nota de salida:', error);
        });
      });
    }
  }
  

  edpr(producto: { producto: Product, cantidad: number, codDetNS?: number}, index: number) {
    this.productoSeleccionado = producto.producto;
    this.cantidadSeleccionada = producto.cantidad;
    this.productoEditandoIndex = index;
  }

}
