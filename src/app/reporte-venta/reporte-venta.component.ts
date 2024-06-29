import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { DetalleFactura } from '../interfaces/detallefactura';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { FacturaService } from '../../services/factura.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.css']
})
export class ReporteVentaComponent implements OnInit {

  listVenta: Factura[] = [];
  listDetalleVenta: DetalleFactura[] = [];
  ventaConDetalle: { factura: Factura, detalleVenta: DetalleFactura[], productos: string, cantidades: string, precios: string }[] = [];
  filteredVentaConDetalle: { factura: Factura, detalleVenta: DetalleFactura[], productos: string, cantidades: string, precios: string }[] = [];

  filters = {
    startDate: '',
    endDate: '',
    Admin: '',
    cliente: '',
    producto: ''
  };

  users: any = "";
  clientes: any = "";
  productos: Product[] = [];

  constructor(
    private _facturaServices: FacturaService,
    private _userServices: UserService,
    private _productoServices: ProductoService,
  ) { }

  ngOnInit(): void {
    this.getlistVenta();
    this.getListCliente();
    this.getListProducto();
    this.getListUser();
  }

  exportToExcel(): void {
    const exportData = this.filteredVentaConDetalle.map(item => ({
      Fecha: item.factura.fecha,
      Producto: item.detalleVenta.map(d => d.categoria_producto_nombre).join(', '),
      Administrador: item.factura.nombre_usuario,
      Cliente: item.factura.nombre_cliente,
      Cantidad: item.detalleVenta.map(d => d.cantidad_producto).join(', '),
      Precio: item.detalleVenta.map(d => d.importe).join(', '),
      Total: item.factura.total
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reportes de Venta': worksheet },
      SheetNames: ['Reportes de Venta']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Reportes de Venta');
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

      doc.save('Reportes de Venta.pdf');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  applyFilters(): void {
    this.filteredVentaConDetalle = this.ventaConDetalle.filter(item => {
      const startDateMatch = !this.filters.startDate || new Date(item.factura.fecha!) >= new Date(this.filters.startDate);
      const endDateMatch = !this.filters.endDate || new Date(item.factura.fecha!) <= new Date(this.filters.endDate);
      const adminMatch = !this.filters.Admin || item.factura.nombre_usuario === this.filters.Admin;
      const clienteMatch = !this.filters.cliente || item.factura.nombre_cliente === this.filters.cliente;
      const productoMatch = !this.filters.producto || item.productos.includes(this.filters.producto);

      return startDateMatch && endDateMatch && adminMatch && clienteMatch && productoMatch;
    });
  }

  getlistVenta(): void {
    this._facturaServices.MostrarFacturas().subscribe((data: Factura[]) => {
      this.listVenta = data;
      this.getAllDetalles();
    });
  }

  getAllDetalles(): void {
    this.listVenta.forEach(venta => {
      this._facturaServices.getDetallesFactura(venta.codigo_factura!).subscribe((data: DetalleFactura[]) => {
        const productos = data.map(d => d.categoria_producto_nombre).join(', ');
        const cantidades = data.map(d => d.cantidad_producto).join(', ');
        const precios = data.map(d => d.importe).join(', ');
        this.ventaConDetalle.push({ factura: venta, detalleVenta: data, productos, cantidades, precios });
      });
    });
  }

  getListUser() {
    this._userServices.getNombreAdmin().subscribe((data: any) => {
      this.users = data;
    })
  }

  getListCliente() {
    this._facturaServices.MostrarClientes().subscribe((data: any) => {
      this.clientes = data;
    })
  }

  getListProducto() {
    this._productoServices.getProducts().subscribe((data: Product[]) => {
      this.productos = data;
    })
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
