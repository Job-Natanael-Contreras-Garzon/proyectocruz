import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
//Modulos
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenderComponent } from './vender/vender.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { LayoutComponent } from './layout/layout.component';
import { AlmacenesComponent } from './almacenes/almacenes.component';
import { ProductoComponent } from './producto/producto.component';
import { InventarioComponent } from './inventario/inventario.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SignInComponent } from './new-User/sign-in.component';
import { NewPasswordComponent } from './new-password/new-password.component';

import { AddNewProveedorComponent } from './add-new-proveedor/add-new-proveedor.component';
import { AddNewAlmacenComponent } from './add-new-almacen/add-new-almacen.component';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { FormVentaComponent } from './form-venta/form-venta.component';
import { FacturaComponent } from './factura/factura.component';
import { NewInventarioComponent } from './new-inventario/new-inventario.component';
import { NotaSalidaComponent } from './nota-salida/nota-salida.component';
import { UpdNewNotaSalidaComponent } from './upd-new-nota-salida/upd-new-nota-salida.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    VenderComponent,
    ProveedorComponent,
    LayoutComponent,
    AlmacenesComponent,
    ProductoComponent,
    InventarioComponent,
    SpinnerComponent,
    SignInComponent,
    NewPasswordComponent,
    AddNewProveedorComponent,
    AddNewAlmacenComponent,
    BitacoraComponent,
    FormVentaComponent,
    FacturaComponent,
    NewInventarioComponent,
    NotaSalidaComponent,
    UpdNewNotaSalidaComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
