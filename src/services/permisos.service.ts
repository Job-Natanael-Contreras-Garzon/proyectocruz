import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';
import { User } from '../app/interfaces/user';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  username: string = '';
  private permSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  perm$: Observable<string | undefined> = this.permSubject.asObservable();

  constructor(
    private _userService: UserService,
    private toastr: ToastrService,
  ) { }

  obtenerPermisos(): void {
    this.getUsernameFromToken();
    this.obtenerPermisosDelUsuario();
  }

  private getUsernameFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        this.username = payload.username;
      } else {
        this.toastr.error('El token no tiene el formato esperado.', 'Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.', 'Error');
    }
  }

  private obtenerPermisosDelUsuario(): void {
    const user: User = {
      nombreAdministrador: '',
      telefono: '',
      correoElectronico: '',
      username: this.username,
      password: '',
      tipoPermiso: '',
    };

    this._userService.UserPerm(user).subscribe((data: User[]) => {
      console.log(data);
      
      if (data && data.length > 0) {
        this.permSubject.next(data[0].categoria);
      } else {
        this.toastr.error('No se encontraron datos de categoría.', 'Error');
        this.permSubject.next(undefined);
      }
    });
  }

}
