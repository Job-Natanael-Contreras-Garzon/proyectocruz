// producto.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { Data, Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { Product } from '../interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { PermisosService } from '../../services/permisos.service';
import { BitacoraService } from '../../services/bitacora.service';



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{
  categoria: string = '';
  marca: string = '';
  stock: number = 0;
  precioCompra: number = 0;
  precioVenta: number = 0;
  fechaVencimiento: Date = new Date();

  listproductos: Product[] = [];
  categorias: string[] = ['Capuchon de triceta','Capuchon de junta', 'Grasa Lubricante','Grasa Grafitada', 'Reten Cigueñal'];
  marcas: string[] = ['Golden', 'Nisan'];
  RegUp:boolean = false;
  cod:number = 0;

  permiso:string | undefined; 

  constructor(private toastr: ToastrService,
    private _productService: ProductoService,
    private router: Router,
    private _permiso:PermisosService,
    private _errorServices: ErrorService,
    private _bitacoraServices: BitacoraService){ }

  ngOnInit(): void {
    this.getListProduct();
    this._permiso.obtenerPermisos();
    this._permiso.perm$.subscribe((permiso: string | undefined) => {
      this.permiso = permiso;
      console.log(this.permiso);
    });
  }
  
  
  
  registrarProducto(): void {
    
    //se crea el body 
    const product: Product = {
      cod:this.cod,
      marca: this.marca, 
      categoria: this.categoria, 
      stock: this.stock, 
      precio_compra: this.precioCompra, 
      precio_venta: this.precioVenta, 
      fecha_vencimiento: this.fechaVencimiento
    }


    //console.log(product);
    
    if (!(this.productoValido())) {
      this.toastr.error("Por favor, complete todos los campos.",'Error');
    }


    if(this.RegUp){
      this._productService.updateProduct(product).subscribe(
        (data: any) => {
          // Manejar la respuesta exitosa aquí  
          this.limpiarCampos();
          this.getListProduct();
          this.toastr.info('Producto Actualizado','Existo')
        },
        (error: HttpErrorResponse) => {
          // Manejar el error aquí
          this._errorServices.msjError(error);
        } 
      );
      this.RegUp=false;
      this._bitacoraServices.ActualizarBitacora("Actualizo un Producto");
    }else{
      this._productService.newProduct(product).subscribe(
        (data: any) => {
          // Manejar la respuesta exitosa aquí  
          this.limpiarCampos();
          this.getListProduct();
          this.toastr.success('Producto Añadido','Existo')
        },
        (error: HttpErrorResponse) => {
          // Manejar el error aquí
          this._errorServices.msjError(error);
        } 
      );
      this._bitacoraServices.ActualizarBitacora("Registro un Nuevo Producto");
    }

    

  }

  PusProduct(product: Product,cod:number) {
    
    this.cod = cod
    this.marca = product.marca;
    this.categoria = product.categoria;
    this.stock = product.stock;
    this.precioCompra = product.precio_compra;
    this.precioVenta = product.precio_venta;
    this.fechaVencimiento = product.fecha_vencimiento;
    this.RegUp=true;
    //updateProduct(item.cod!,item.marca!,item.categoria!,item.stock,item.precio_compra,item.precio_venta,item.fecha_vencimiento)
  }


  deleteProduct(cod:number){
    this._productService.deleteProduct(cod).subscribe(()=>{
      this.toastr.warning('Eliminado con Existo')
      this.getListProduct();
      this._bitacoraServices.ActualizarBitacora("Elimino un Producto");
    })
  }

  getListProduct(): void{
    this._productService.getProducts().subscribe((data:Product[])=>{
      this.listproductos=data;      
    })
  }


  productoValido(): boolean {
    return this.categoria !== '' && this.marca !== '' && this.stock > 0 && this.precioCompra > 0;
  }
  

  limpiarCampos() {
    this.categoria = '';
    this.marca = '';
    this.stock = 0;
    this.precioCompra = 0;
    this.precioVenta = 0;
    this.fechaVencimiento = new Date();
  }
}
