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
    const filtroFechaInput = (document.getElementById('filtroFecha') as HTMLInputElement).value;
    console.log(filtroFechaInput);
    
    
    if (filtroNombre !== "" || filtroFechaInput !== "") {
      const filtroFecha = filtroFechaInput;
      this.listBitacora = this.listBitacora.filter(data => {
        const nombre = data.nombre_usuario.toLowerCase();       
        const fecha = data.fechahora ? this.convertirFecha(data.fechahora) : undefined;       
        const cumpleNombre = nombre.includes(filtroNombre);
        const cumpleFecha = filtroFecha ? fecha === filtroFecha : true;
        return cumpleNombre && cumpleFecha;
      });
    } else {
      this.getListBitacora();
    } 
  };
  
  
  convertirFecha(fechaString: string | undefined): string {
    if (!fechaString || typeof fechaString !== 'string') {
      return ''; // O puedes manejar esto según tu lógica
    }
  
    const parts = fechaString.split(" ");
    if (parts.length !== 2) {
      return ''; // O puedes manejar esto según tu lógica
    }
  
    const [fecha, hora] = parts;
    const fechaParts = fecha.split("/");
    const horaParts = hora.split(":");
    
    if (fechaParts.length !== 3 || horaParts.length !== 3) {
      return ''; // O puedes manejar esto según tu lógica
    }
  
    const [dia, mes, año] = fechaParts;
    const [horaNum, minuto, segundo] = horaParts;
    const fechaFormateada = new Date(`${mes}/${dia}/${año} ${horaNum}:${minuto}:${segundo}`);
    
    // Formatear la fecha sin la hora y la zona horaria
    const fechaFormateadaSinHora = `${fechaFormateada.getFullYear()}-${this.padZero(fechaFormateada.getMonth() + 1)}-${this.padZero(fechaFormateada.getDate())}`;
    
    return fechaFormateadaSinHora;
  }
  
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
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