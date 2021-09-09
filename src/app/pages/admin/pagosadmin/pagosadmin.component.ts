import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Paquetes } from '../../../models/Paquetes';
import { PaquetesService } from '../../../services/paquetes.service';
import { PagosDto } from '../../../models/PagosDto';
import { PagosService } from '../../../services/pagos.service';
import { Estudiante } from '../../../models/Estudiante';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
    selector: 'app-pagosadmin',
    templateUrl: './pagosadmin.component.html',
    styleUrls: ['./pagosadmin.component.css'],
    providers: [MessageService]
})
export class PagosadminComponent implements OnInit {

    displayDialogAdd: boolean = false;

    uploadedFiles: any[] = [];
    exportColumns: any[];
    cols: any[];

    pagosList: PagosDto[];

    paquetesList: Paquetes[];
    paqueteSeleccionado: Paquetes = new Paquetes();

    estudiantesList: Estudiante[];
    estudianteSeleccionado: Estudiante = new Estudiante();

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private paquetesService: PaquetesService,
        private pagosService: PagosService,
        private estudianteService: EstudianteService
    ) { }

    ngOnInit(): void {
        this.estudianteService.obtenerEstudiantes().then(data => this.estudiantesList = data);
        this.paquetesService.obtenerTodo().then(res => { this.paquetesList = res; console.log(this.paquetesList) });
        this.pagosService.obtenerTodo().then(res => this.pagosList = res);

        this.cols = [
            { field: 'nombreestudiantes', header: 'Nombre Estudiante' },
            { field: 'descripcionpaquete', header: 'Descripción Paquete' },
            { field: 'tipopaquetes', header: 'Tipo Paquete' },
            { field: 'costopaquete', header: 'Costo Paquete' },
            { field: 'nombreevento', header: 'Nombre Evento' },
            { field: 'fechapago', header: 'Fecha Pago' },
            { field: 'estadopago', header: 'Estado Pago' },
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

    formatDate(date) {
        moment.locale('es');
        var date2 = new Date(date);
        // return date2.toLocaleString();
        return moment(date2).format('DD/MM/yy');
    }

    guardarPago() {
        if (this.estudianteSeleccionado.idestudiantes == null) {
            this.showMensaje('warn', 'Mensaje', 'Es necesario agregar un estudiante');
            return;
        }

        if (this.paqueteSeleccionado.idpaquetes == null) {
            this.showMensaje('warn', 'Mensaje', 'Es necesario agregar un paquete');
            return;
        }

        let pago: PagosDto = new PagosDto();
        pago.idestudiante = this.estudianteSeleccionado.idestudiantes;
        pago.idpaquete = this.paqueteSeleccionado.idpaquetes;
        pago.estadopago = "completado";
        pago.fechapago = new Date();

        this.pagosService.guardar(pago).subscribe(
            res => {
                this.fDisplayDialogAdd();
                this.estudianteSeleccionado = new Estudiante();
                this.paqueteSeleccionado = new Paquetes();
                this.pagosService.obtenerTodo().then(res => this.pagosList = res);
            }
        );
    }

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    confirmDelete(pago: PagosDto) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea Eliminar el pago: ${pago.descripcionpaquete} de ${pago.nombreestudiantes} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.pagosService.eliminar(pago.idpagos).subscribe(
                    res => {
                        this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                        this.pagosService.obtenerTodo().then(res => this.pagosList = res);
                    },
                    err => {
                        this.showMensaje('error', 'Mensaje', 'No se pudo eliminar.');
                    }
                );

            }
        });
    }

    confirmCambiarEstadoPendiente(pago: PagosDto) {
        this.confirmationService.confirm({
            message: `¿Desea cambiar el estado del pago a "PENDIENTE" ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                pago.estadopago = "pendiente";
                this.pagosService.cambiarEstado(pago).subscribe(
                    res => {
                        this.showMensaje('success', 'Mensaje', 'Se cambió correctamente.');
                        this.pagosService.obtenerTodo().then(res => this.pagosList = res);
                    },
                    err => {
                        this.showMensaje('error', 'Mensaje', 'No se pudo cambiar.');
                    }
                );

            }
        });
    }

    confirmCambiarEstadoCompletado(pago: PagosDto) {
        this.confirmationService.confirm({
            message: `¿Desea cambiar el estado del pago a "COMPLETADO" ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                pago.estadopago = "completado";
                this.pagosService.cambiarEstado(pago).subscribe(
                    res => {
                        this.showMensaje('success', 'Mensaje', 'Se cambió correctamente.');
                        this.pagosService.obtenerTodo().then(res => this.pagosList = res);
                    },
                    err => {
                        this.showMensaje('error', 'Mensaje', 'No se pudo cambiar.');
                    }
                );

            }
        });
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.text('Pagos', 100, 10);
                doc.autoTable(this.exportColumns, this.pagosList);
                doc.save('pagos.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.pagosList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "pagos");
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        import("file-saver").then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data: Blob = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }
}
