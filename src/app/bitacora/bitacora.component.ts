import { Component, OnInit } from '@angular/core';
import { BitacoraService } from '../../services/bitacora.service';
import { Bitacora } from '../interfaces/bitacora';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit{
  
  constructor(private _bitacoraService: BitacoraService) { }
  ngOnInit(): void {
    //this.registrarAccion();
    this.getListBitacora();
  }


  listBitacora: Bitacora[] = [];

  registros: string[] = [
    '1,Mark,192.228.15.57,2024-06-01, Lorem ipsum dolor sit amet',
    '2,Jacob,,2024-06-02, Consectetur adipiscing elit',
    '3,Larry,,2024-06-03, Vestibulum at eros'
  ];

  filtrar() {
    const filtroNombre = (document.getElementById('filtroNombre') as HTMLInputElement).value.toLowerCase(); 
    const filtroFecha = (document.getElementById('filtroFecha') as HTMLInputElement).value;
  
    if(filtroNombre!="" || filtroFecha!=""){
      // Realizar el filtrado en base a registrosObjeto
    this.listBitacora = this.listBitacora.filter(data => {
      const nombre = data.nombre_usuario.toLowerCase();
      const fecha = data.fechahora;
      const cumpleNombre = nombre.includes(filtroNombre);
      const cumpleFecha = filtroFecha ? fecha === filtroFecha : true;
      return cumpleNombre && cumpleFecha;
    });
    }else{
      this.getListBitacora();
    } 
  }

  getListBitacora(): void{
    this._bitacoraService.getBitacora().subscribe((data:Bitacora[])=>{
      this.listBitacora=data;      
    })
  }

  /*registrarAccion() {
    this.bitacoraService.obtenerDireccionIP().subscribe(
      response => {
        console.log('Actividad registrada:', response);
      },
      error => {
        console.error('Error al registrar actividad:', error);
      }
    );
  }
  */
}

