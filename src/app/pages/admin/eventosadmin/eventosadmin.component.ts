import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../services/eventos.service';
import { Eventos } from '../../../models/Eventos';
import { ConfirmationService } from 'primeng/api';
import { Moment } from "moment";
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-eventosadmin',
    templateUrl: './eventosadmin.component.html',
    styleUrls: ['./eventosadmin.component.css'],
    providers: [MessageService]
})
export class EventosadminComponent implements OnInit {
    closeResult = '';
    adminNav: boolean = false;
    displayCreateDialog: boolean = false;
    displayEditDialog: boolean = false;

    eventosList: Eventos[];
    eventoNew: Eventos = new Eventos();
    eventoSeleccionado = new Eventos();

    fecha1: Date;
    fecha2: Date;

    cols: any[];

    exportColumns: any[];

    es: any;

    constructor(
        private eventosService: EventosService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar'
        };

        this.eventosService.obtenerEventos().then(
            res => {
                this.eventosList = res;
                console.log(this.eventosList);
            }
        );

        this.cols = [
            { field: 'nombreevento', header: 'Nombre' },
            { field: 'descripcionevento', header: 'Descripción' },
            { field: 'eventosmaxparticipantes', header: 'Máx. participantes' },
            { field: 'fechainicioevento', header: 'Fecha inicio' },
            { field: 'fechafinEvento', header: 'Fecha final' },
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarEvento() {
        this.eventosService.guardarEvento(this.eventoNew).subscribe(res => {
            this.showMensaje('success', 'Mensaje', 'Se creó correctamente.');
            this.eventosService.obtenerEventos().then(res => this.eventosList = res);
            this.eventoNew = new Eventos();
            this.fDisplayCreateDialog();
        });
    }

    formatDate(date) {
        moment.locale('es');
        return moment(date).format('DD/MM/yy h:mm:ss a');
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.eventosList);
                doc.save('eventos.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.eventosList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "eventos");
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

    fDisplayCreateDialog(): void {
        this.displayCreateDialog = !this.displayCreateDialog;
    }

    confirmDelete(evento: any) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea Eliminar el evento: ${evento.nombreevento} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.eventosService.borrarEvento(evento.ideventos).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.eventosService.obtenerEventos().then(res => this.eventosList = res);
                });
            }
        });
    }

    fDisplayEditDialog(eventoSeleccionado) {

        this.fecha1 = this.eventoSeleccionado.fechainicioevento;
        this.fecha2 = this.eventoSeleccionado.fechafinEvento;

        this.eventoSeleccionado = eventoSeleccionado;
        this.displayEditDialog = !this.displayEditDialog;
    }

    editarEvento() {
        console.log(this.fecha1);
        this.eventoSeleccionado.fechainicioevento = this.fecha1;
        this.eventoSeleccionado.fechafinEvento = this.fecha2;

        /* código para fixear la horá porque se buggea al subir y se suman 7 horas más */
        // Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
        let hourFix = this.eventoSeleccionado.fechainicioevento.getHours() - 7; 
        this.eventoSeleccionado.fechainicioevento.setHours(hourFix);
        hourFix = this.eventoSeleccionado.fechafinEvento.getHours() - 7;
        this.eventoSeleccionado.fechafinEvento.setHours(hourFix);
        /* fin fix */

        this.eventosService.editarEvento(this.eventoSeleccionado).subscribe(res => {
            this.showMensaje('success', 'Mensaje', 'Se guardó correctamente.');
            this.eventosService.obtenerEventos().then(res => this.eventosList = res);
            this.displayEditDialog = false;
            this.eventoSeleccionado = new Eventos();
        });
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

}