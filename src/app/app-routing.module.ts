import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { VenderComponent } from './vender/vender.component';

const routes: Routes = [
  {
    path: '',//ruta 
    component: LoginComponent,
    data: { name: 'login' }
  },
  {
    path: 'Vender',//ruta 
    component: VenderComponent,
    data: { name: 'vender' }
  },
  // {
  //   path: '**',//ruta,    
  //   redirectTo: 'menu',  
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
