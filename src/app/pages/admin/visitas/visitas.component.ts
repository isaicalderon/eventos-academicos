import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventosService } from '../../../services/eventos.service';
import { Eventos } from '../../../models/Eventos';
import { Visitas } from '../../../models/Visitas';
import { VisitasService } from '../../../services/visitas.service';
import * as moment from 'moment';

@Component({
    selector: 'app-visitas',
    templateUrl: './visitas.component.html',
    styleUrls: ['./visitas.component.css'],
    providers: [MessageService]
})
export class VisitasComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    visitasList: Visitas[];
    visitaNew: Visitas = new Visitas();
    visitaSlecccionada: Visitas = new Visitas();

    eventosList: Eventos[];
    eventoSeleccionado: Eventos = new Eventos();

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private eventosService: EventosService,
        private visitasService: VisitasService
    ) { }

    ngOnInit(): void {
        this.visitasService.obtenerTodo().then(res => this.visitasList = res);
        this.eventosService.obtenerEventos().then(res => this.eventosList = res);

        this.cols = [
            { field: 'visitanombre', header: 'Nombre visita' },
            { field: 'visitadescripción', header: 'Descripción visita' },
            { field: 'visitafechainicio', header: 'Fecha inicio' },
            { field: 'visitafechafin', header: 'Fecha final' },
            { field: 'visitalugar', header: 'Lugar visita' },
            { field: 'visitamaxparticipante', header: 'Máx. Participantes' },
            { field: 'nombreevento', header: 'Evento' }
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarVisita() {
        try {
            /* 
            Código para fixear la horá porque se buggea al subir y se suman 7 horas más 
            Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
            */
            let hourFix = this.visitaNew.visitafechainicio.getHours() - 7;
            this.visitaNew.visitafechainicio.setHours(hourFix);
            hourFix = this.visitaNew.visitafechafin.getHours() - 7;
            this.visitaNew.visitafechafin.setHours(hourFix);
            /* fin fix */

            this.visitaNew.ideventos = this.eventoSeleccionado.ideventos;

            this.visitasService.guardar(this.visitaNew).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                    this.fDisplayDialogAdd();
                    this.visitaNew = new Visitas();
                    this.visitasService.obtenerTodo().then(res => this.visitasList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un error al intentar guardar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo guardar, es posible que falte un campo por llenar');
        }
    }

    editarVisita() {
        try {
            /* 
            Código para fixear la horá porque se buggea al subir y se suman 7 horas más 
            Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
            */
            let hourFix = this.visitaSlecccionada.visitafechainicio.getHours() - 7;
            this.visitaSlecccionada.visitafechainicio.setHours(hourFix);
            hourFix = this.visitaSlecccionada.visitafechafin.getHours() - 7;
            this.visitaSlecccionada.visitafechafin.setHours(hourFix);
            /* fin fix */
            
            this.visitaSlecccionada.ideventos = this.eventoSeleccionado.ideventos;

            this.visitasService.editar(this.visitaSlecccionada).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                    this.fDisplayDialogEdit(null);
                    this.visitaSlecccionada = new Visitas();
                    this.visitasService.obtenerTodo().then(res => this.visitasList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un error al intentar editar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo editar, es posible que falte un campo por llenar');
        }
    }

    confirmDelete(visita: Visitas) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar la visita: ${visita.visitanombre} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.visitasService.eliminar(visita.idvisitas).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.visitasService.obtenerTodo().then(res => this.visitasList = res);
                });
            }
        });
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(visita: Visitas) {
        this.visitaSlecccionada = visita;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.visitasList);
                doc.save('visitas.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.visitasList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "visitas");
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

    formatDate(date) {
        moment.locale('es');
        return moment(date).format('DD/MM/yy h:mm:ss a');
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }
}
