import { Component, OnInit } from '@angular/core';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit{

  constructor(private bitacoraService: BitacoraService) { }
  ngOnInit(): void {
    //this.registrarAccion();
    this.parseRegistros();
  }

  nombreusuario:string='Sebas';
  accion:string='Inicio secion';

  registrosObjeto: any[] = [];

  registros: string[] = [
    '1,Mark,192.228.15.57,2024-06-01, Lorem ipsum dolor sit amet',
    '2,Jacob,,2024-06-02, Consectetur adipiscing elit',
    '3,Larry,,2024-06-03, Vestibulum at eros'
  ];

  parseRegistros() {
    this.registrosObjeto = this.registros.map(registro => {
      const partes = registro.split(',');
      return {
        '#': partes[0],
        'Usuario': partes[1],
        'Ip': partes[2],
        'Fecha y hora': partes[3],
        'Descripción': partes[4]
      };
    });
  }

  filtrar() {
    const filtroNombre = (document.getElementById('filtroNombre') as HTMLInputElement).value.toLowerCase(); 
    const filtroFecha = (document.getElementById('filtroFecha') as HTMLInputElement).value;
  
    if(filtroNombre!="" || filtroFecha!=""){
      // Realizar el filtrado en base a registrosObjeto
    this.registrosObjeto = this.registrosObjeto.filter(registro => {
      const nombre = registro.Usuario.toLowerCase();
      const fecha = registro['Fecha y hora'];
      const cumpleNombre = nombre.includes(filtroNombre);
      const cumpleFecha = filtroFecha ? fecha === filtroFecha : true;
      return cumpleNombre && cumpleFecha;
    });
    }else{
      this.parseRegistros();
    } 
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

