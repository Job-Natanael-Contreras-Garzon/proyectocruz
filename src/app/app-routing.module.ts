// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VenderComponent } from './vender/vender.component';
import { LayoutComponent } from './layout/layout.component';
import { AlmacenesComponent } from './almacenes/almacenes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ProductoComponent } from './producto/producto.component';
import { SignInComponent } from './new-User/sign-in.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { AddNewProveedorComponent } from './add-new-proveedor/add-new-proveedor.component';
import { AddNewAlmacenComponent } from './add-new-almacen/add-new-almacen.component';

const routes: Routes = [
  {path: '', redirectTo: 'login',pathMatch:'full'},
  { path: 'login',component: LoginComponent},

  { path: 'home', component: LayoutComponent, children: [
    //{ path: '', redirectTo: '', pathMatch: 'full' }, // Redirige a la página de almacenes por defecto
    { path: 'almacen', component: AlmacenesComponent },// Ruta para el componente de almacenes 
    { path: 'proveedores', component: ProveedorComponent },
    { path: 'vender', component : VenderComponent }, 
    { path: 'productos', component : ProductoComponent },  
    { path: 'registro', component : SignInComponent },
    { path: 'newPassword', component : NewPasswordComponent},
    { path: 'add', component : AddNewProveedorComponent},
    { path: 'edit/:codigo', component : AddNewProveedorComponent},
    { path: 'addAlma', component : AddNewAlmacenComponent},
    { path: 'editAlma/:id', component : AddNewAlmacenComponent},
  ]},
  { path: '**',redirectTo: 'login',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
