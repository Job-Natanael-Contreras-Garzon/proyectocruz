import { Component, OnInit } from '@angular/core';
import { Bitacora } from '../interfaces/bitacora';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from '../../services/user.service';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-reporte-actividad',
  templateUrl: './reporte-actividad.component.html',
  styleUrls: ['./reporte-actividad.component.css']
})
export class ReporteActividadComponent implements OnInit {
  listBitacora: Bitacora[] = [];
  filterBitacora: Bitacora[] = [];

  filters = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    User: ''
  };

  users: any = "";

  constructor(
    private _userServices: UserService,
    private _bitacoraServices: BitacoraService
  ) { }

  ngOnInit(): void {
    this.getListUser();
    this.getListBitacora();
  }

  exportToExcel(): void {
    const exportData = this.filterBitacora.map(item => ({
      Fecha: item.fechahora,
      Usuario: item.nombre_usuario,
      DireccionIP: item.ip,
      Descripcion: item.descripcion
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reportes de Actividad': worksheet },
      SheetNames: ['Reportes de Actividad']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Reportes de Actividad');
  }

  exportToPDF(): void {
    const data = document.getElementById('pdfTable')!;
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const doc = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('Reporte de Actividad.pdf');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  applyFilters(): void {
    this.filterBitacora = this.listBitacora.filter(item => {
      const itemDate = new Date(item.fechahora.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'));
      const startDateTime = this.filters.startDate ? new Date(this.filters.startDate + 'T' + (this.filters.startTime || '00:00')) : null;
      const endDateTime = this.filters.endDate ? new Date(this.filters.endDate + 'T' + (this.filters.endTime || '23:59')) : null;

      const startDateMatch = !startDateTime || itemDate >= startDateTime;
      const endDateMatch = !endDateTime || itemDate <= endDateTime;
      const userMatch = !this.filters.User || item.nombre_usuario === this.filters.User;

      return startDateMatch && endDateMatch && userMatch;
    });
  }

  getListUser(): void {
    this._userServices.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  getListBitacora(): void {
    this._bitacoraServices.getBitacora().subscribe((data: Bitacora[]) => {
      this.listBitacora = data;
    });
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
