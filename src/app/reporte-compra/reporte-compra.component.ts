import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ProveedoresService } from '../../services/proveedores.service';
import { BoletacompraService } from '../../services/boletacompra.service';
import { UserService } from '../../services/user.service';
import { ProductoService } from '../../services/producto.service';
import { Proveedores } from '../interfaces/proveedores';
import { Boleta_Compra } from '../interfaces/boleta_compra';
import { DetalleBoletaCompra } from '../interfaces/detalle_boleta_compra';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reporte-compra',
  templateUrl: './reporte-compra.component.html',
  styleUrl: './reporte-compra.component.css'
})
export class ReporteCompraComponent implements OnInit {
  listCompra: Boleta_Compra[] = [];
  listDetalleCompra: DetalleBoletaCompra[] = [];
  compraConDetalle: { boleta: Boleta_Compra, detalleCompra: DetalleBoletaCompra[], productos: string, cantidades: string, precios: string }[] = [];
  filteredCompraConDetalle: { boleta: Boleta_Compra, detalleCompra: DetalleBoletaCompra[], productos: string, cantidades: string, precios: string }[] = [];

  filters = {
    startDate: '',
    endDate: '',
    Admin: '',
    proveedor: '',
    producto: ''
  };

  users: any = "";
  proveedores: Proveedores[] = [];
  productos: Product[] = [];

  constructor(
    private _proveedorServices: ProveedoresService,
    private _boletacompraServices: BoletacompraService,
    private _userServices: UserService,
    private _productoServices: ProductoService,
  ) { }

  ngOnInit(): void {
    this.getlistCompra();
    this.getListUser();
    this.getListProveedor();
    this.getListProducto();
  }

  exportToExcel(): void {
    const exportData = this.filteredCompraConDetalle.map(item => ({
      Fecha: item.boleta.fecha,
      Producto: item.detalleCompra.map(d => d.nombre_producto).join(', '),
      Administrador: item.boleta.nombre_administrador,
      Proveedor: item.boleta.nombre_proveedor,
      Cantidad: item.detalleCompra.map(d => d.cantidad).join(', '),
      Precio: item.detalleCompra.map(d => d.importe).join(', '),
      Total: item.boleta.total
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reportes de Compra': worksheet },
      SheetNames: ['Reportes de Compra']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Reportes de Compra');
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

      doc.save('Reportes de Compra.pdf');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  applyFilters(): void {
    this.filteredCompraConDetalle = this.compraConDetalle.filter(item => {
      const startDateMatch = !this.filters.startDate || new Date(item.boleta.fecha!) >= new Date(this.filters.startDate);
      const endDateMatch = !this.filters.endDate || new Date(item.boleta.fecha!) <= new Date(this.filters.endDate);
      const adminMatch = !this.filters.Admin || item.boleta.nombre_administrador === this.filters.Admin;
      const proveedorMatch = !this.filters.proveedor || item.boleta.nombre_proveedor === this.filters.proveedor;
      const productoMatch = !this.filters.producto || item.productos.includes(this.filters.producto);

      return startDateMatch && endDateMatch && adminMatch && proveedorMatch && productoMatch;
    });
  }

  getlistCompra(): void {
    this._boletacompraServices.MostrarBoletasCompra().subscribe((data: Boleta_Compra[]) => {
      this.listCompra = data;
      this.getAllDetalles();
    });
  }

  getAllDetalles(): void {
    this.listCompra.forEach(compra => {
      this._boletacompraServices.getDetallesBoletaCompra(compra.nroboleta!).subscribe((data: DetalleBoletaCompra[]) => {
        const productos = data.map(d => d.nombre_producto).join(', ');
        const cantidades = data.map(d => d.cantidad).join(', ');
        const precios = data.map(d => d.importe).join(', ');
        this.compraConDetalle.push({ boleta: compra, detalleCompra: data, productos, cantidades, precios });
      });
    });
  }

  getListUser() {
    this._userServices.getNombreAdmin().subscribe((data: any) => {
      this.users = data;
    });
  }

  getListProveedor() {
    this._proveedorServices.getlistProveedores().subscribe((data: Proveedores[]) => {
      this.proveedores = data;
    });
  }

  getListProducto() {
    this._productoServices.getProducts().subscribe((data: Product[]) => {
      this.productos = data;
    });
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';