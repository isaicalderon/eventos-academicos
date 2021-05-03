import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../services/eventos.service';
import { Eventos } from '../../../models/Eventos';
import { ConfirmationService } from 'primeng/api';
import { Moment } from "moment";
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

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
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private eventosService: EventosService,
        private authService: AuthService
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

        this.eventosService.obtenerEventos().then(res => this.eventosList = res);

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
        try {
            /* código para fixear la horá porque se buggea al subir y se suman 7 horas más */
            // Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
            // let hourFix = this.eventoNew.fechainicioevento.getHours() - 7;
            // this.eventoNew.fechainicioevento.setHours(hourFix);
            // hourFix = this.eventoNew.fechafinEvento.getHours() - 7;
            // this.eventoNew.fechafinEvento.setHours(hourFix);
            /* fin fix */

            this.eventoNew.fechainicioevento_ts = this.eventoNew.fechainicioevento.getTime() + "";
            this.eventoNew.fechafinevento_ts = this.eventoNew.fechafinevento.getTime() + "";

            this.eventosService.guardarEvento(this.eventoNew).subscribe(
                res => {
                    this.showMensaje('success', 'Mensaje', 'Se creó correctamente.');
                    this.eventosService.obtenerEventos().then(res => this.eventosList = res);
                    this.eventoNew = new Eventos();
                    this.fDisplayCreateDialog();
                },
                err => {
                    this.showMensaje('error', 'Mensaje', 'Ocurrió un error al intentar guardar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Mensaje', 'No se pudo guardar, es posible que un campo este incompleto.');
        }
    }

    editarEvento() {
        // console.log(this.fecha1);

        this.eventoSeleccionado.fechainicioevento = this.fecha1;
        this.eventoSeleccionado.fechafinevento = this.fecha2;

        /* código para fixear la horá porque se buggea al subir y se suman 7 horas más */
        // Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
        // let hourFix = this.eventoSeleccionado.fechainicioevento.getHours() - 7;
        // this.eventoSeleccionado.fechainicioevento.setHours(hourFix);
        // hourFix = this.eventoSeleccionado.fechafinevento.getHours() - 7;
        // this.eventoSeleccionado.fechafinevento.setHours(hourFix);
        /* fin fix */

        this.eventoSeleccionado.fechainicioevento_ts = this.eventoSeleccionado.fechainicioevento.getTime() + "";
        this.eventoSeleccionado.fechafinevento_ts = this.eventoSeleccionado.fechafinevento.getTime() + "";
        
        this.eventosService.editarEvento(this.eventoSeleccionado).subscribe(res => {
            this.showMensaje('success', 'Mensaje', 'Se guardó correctamente.');
            this.eventosService.obtenerEventos().then(res => this.eventosList = res);
            this.displayEditDialog = false;
            this.eventoSeleccionado = new Eventos();
        });
    }

    formatDate(date) {
        moment.locale('es');
        var date2 = new Date(date * 1);
        // return date2.toLocaleString();
        return moment(date2).format('DD/MM/yy h:mm:ss a');
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
        try {

            this.confirmationService.confirm({
                message: `Los datos no podrán ser restaurados ¿Desea Eliminar el evento: ${evento.nombreevento} ?`,
                acceptLabel: 'Sí',
                acceptButtonStyleClass: 'p-button-primary',
                rejectButtonStyleClass: 'p-button-secondary',
                defaultFocus: 'reject',
                accept: () => {
                    this.eventosService.borrarEvento(evento.ideventos).subscribe(
                        res => {
                            this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                            this.eventosService.obtenerEventos().then(res => this.eventosList = res);
                        },
                        err => {
                            this.showMensaje('error', 'Mensaje', 'No se pudo borrar, es posible que exista un registro ligado a este evento');
                        }
                    );
                }
            });
        } catch (error) {
            this.showMensaje('warn', 'Mensaje', 'No se pudo borrar');
        }
    }

    fDisplayEditDialog(eventoSeleccionado: any) {
        this.eventoSeleccionado = eventoSeleccionado;

        let unixI: number = eventoSeleccionado.fechainicioevento_ts * 1;
        let unixF: number = eventoSeleccionado.fechafinevento_ts * 1;
        
        this.fecha1 = new Date(unixI * 1);
        this.fecha2 = new Date(unixF * 1);
 
        this.displayEditDialog = !this.displayEditDialog;
    }



    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

    isAdmin() {
        return this.authService.isAdmin();
    }

}