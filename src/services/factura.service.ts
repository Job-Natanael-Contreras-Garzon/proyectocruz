import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Factura } from '../app/interfaces/factura';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/factura';
  }


  newFactura(factura: Factura):Observable<void>{
    //console.log("holaa");
    
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newFactura`,factura);
 }
}
