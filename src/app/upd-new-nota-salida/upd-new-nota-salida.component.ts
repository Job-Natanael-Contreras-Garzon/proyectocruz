import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { NotaSalidaService } from '../../services/nota-salida.service';
import { NotaSalida } from '../interfaces/nota_salida';
import { DetalleNotaSalida } from '../interfaces/detalle_nota_salida';
import { BitacoraService } from '../../services/bitacora.service';
import { Permiso } from '../interfaces/permiso';
import { PermisosService } from '../../services/permisos.service';
import { ErrorService } from '../../services/error.service';


@Component({
  selector: 'app-upd-new-nota-salida',
  templateUrl: './upd-new-nota-salida.component.html',
  styleUrl: './upd-new-nota-salida.component.css'
})
export class UpdNewNotaSalidaComponent implements OnInit{

  getError: boolean=false;

  username: string = "";
  editar: boolean = false;

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
    private _permisoServices: PermisosService,
    private toastr: ToastrService,
    private _NotaSalidaServices: NotaSalidaService,
    private aRouter: ActivatedRoute,
    private _DetalleSalidaServices: NotaSalidaService,
    private _bitacoraServices:BitacoraService,
    private errorService: ErrorService,
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
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos() {
    this._permisoServices.getPermiso(this.username, "notasalida").subscribe(
      (data: Permiso[]) => {
        data.forEach((perm: Permiso) => {
          this.editar = perm.perm_editar!;
        });
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
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

  getListDetalleNotaSalida() {
    this._NotaSalidaServices.getDetalleNotaSalida(this.cod).subscribe(
      (data: DetalleNotaSalida[]) => {
        this.listDetNosaSalida = data;
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
  }

  getNotaSalida() {
    this._NotaSalidaServices.getNotaSalida(this.cod).subscribe(
      (data: NotaSalida) => {
        this.origen = data.origen;
        this.descripcion = data.descripcion;
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
  }

  confirm() {
    const notasalida: NotaSalida = {
      origen: this.origen,
      descripcion: this.descripcion,
      fecha: new Date(),
    };
  
    if (this.cod !== 0) {
      // Eliminar producto si ya confirmó
      if (this.detallesAEliminar.length > 0) {
        this.detallesAEliminar.forEach(codDetNS => {
          this._DetalleSalidaServices.deleteDetalleNotaSalida(codDetNS).subscribe(
            () => {},
            error => this.errorService.msjError(error) // Manejar error con ErrorService
          );
        });
      }
  
      this._NotaSalidaServices.UpdateNotaSalida(this.cod, notasalida).subscribe(
        () => {
          this.toastr.success(`Nota de salida: ${this.cod} Actualizada con éxito`, 'Nota de salida Actualizada');
          this._bitacoraServices.ActualizarBitacora(`Actualizó nota de salida con origen: ${notasalida.origen}`);
        },
        error => this.errorService.msjError(error) // Manejar error con ErrorService
      );
  
      this.detNotaSalida();
    } else {
      this._NotaSalidaServices.newNotaSalida(notasalida).subscribe(
        (data: number) => {
          this.cod_salida = data;
          this.detNotaSalida();
          console.log(this.getError);
          if(!this.getError){
            this.toastr.success('Nota de salida creada con éxito', 'Nota de salida Creada');
            this._bitacoraServices.ActualizarBitacora(`Se insertó una nueva nota de salida con origen: ${notasalida.origen}`);
          }
        },
        error => this.errorService.msjError(error) // Manejar error con ErrorService
      );
    }
  }
  

  

  detNotaSalida() {
    if (this.cod !== 0) {
      this.productosSeleccionados.forEach(item => {
        if (item.codDetNS) {
          const detNotaSalida: DetalleNotaSalida = {
            cod_detalle: item.codDetNS,
            nombre_producto: item.producto.categoria,
            cantidad: item.cantidad,
          };
          this._DetalleSalidaServices.updateDetalleNotaSalida(detNotaSalida).subscribe(
            () => {},
            error => {
              this.errorService.msjError(error)
              this.getError=true;
            } // Manejar error con ErrorService
          );
        } else {
          const detNotaSalida: DetalleNotaSalida = {
            cod_salida: this.cod_salida,
            nombre_producto: item.producto.categoria,
            cantidad: item.cantidad,
          };
          this._DetalleSalidaServices.newDetalleNotaSalida(detNotaSalida).subscribe(
            () => {},
            error => {
              this.errorService.msjError(error)
              this.getError=true;
            } // Manejar error con ErrorService
          );
        }
      });
    } else {
      this.productosSeleccionados.forEach(item => {
        const detNotaSalida: DetalleNotaSalida = {
          cod_salida: this.cod_salida,
          nombre_producto: item.producto.categoria,
          cantidad: item.cantidad,
        };
        this._DetalleSalidaServices.newDetalleNotaSalida(detNotaSalida).subscribe(
          () => {},
          error => this.errorService.msjError(error) // Manejar error con ErrorService
        );
      });
    }
  }
  
  

  edpr(producto: { producto: Product, cantidad: number, codDetNS?: number}, index: number) {
    this.productoSeleccionado = producto.producto;
    this.cantidadSeleccionada = producto.cantidad;
    this.productoEditandoIndex = index;
  }

}
