import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Eventos } from 'src/app/models/Eventos';
import { Talleres } from 'src/app/models/Talleres';
import { EventosService } from 'src/app/services/eventos.service';
import { TalleresService } from 'src/app/services/talleres.service';
import { TalleristasService } from '../../../services/talleristas.service';
import { Tallerista } from 'src/app/models/Tallerista';

@Component({
    selector: 'app-talleres',
    templateUrl: './talleres.component.html',
    styleUrls: ['./talleres.component.css'],
    providers: [MessageService]
})
export class TalleresComponent implements OnInit {

    displayCreateDialog: boolean = false;
    displayDialogEdit: boolean = false;

    talleresList: Talleres[];
    tallerNew: Talleres = new Talleres();
    tallerSeleccionado: Talleres = new Talleres();


    talleristaList: Tallerista[];
    talleristaSelecionado: Tallerista = new Tallerista();

    eventosList: Eventos[];
    eventoSeleccionado: Eventos;

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private talleresService: TalleresService,
        private eventosService: EventosService,
        private talleristasService: TalleristasService
    ) { }

    ngOnInit(): void {
        this.talleresService.obtenerTalleres().then(res => this.talleresList = res);
        this.eventosService.obtenerEventos().then(res => this.eventosList = res);
        this.talleristasService.obtenerTodo().then(res => this.talleristaList = res);

        this.cols = [
            { field: 'nombretalleres', header: 'Nombre Taller' },
            { field: 'descripciontaller', header: 'Descripción Taller' },
            { field: 'temariotaller', header: 'Máx. participantes' },
            { field: 'tallermaxparticipante', header: 'Máx. participantes' },
            { field: 'tallerlugar', header: 'Lugar taller' },
            { field: 'nombreevento', header: 'Nombre evento' },
            { field: 'fechainiciotaller', header: 'Fecha taller' },
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    fDisplayCreateDialog(): void {
        this.displayCreateDialog = !this.displayCreateDialog;
    }
    fDisplayDialogEdit(taller) {
        this.tallerSeleccionado = taller;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    guardarTaller() {
        try {
            /* código para fixear la horá porque se buggea al subir y se suman 7 horas más */
            // Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
            let hourFix = this.tallerNew.fechainiciotaller.getHours() - 7;
            this.tallerNew.fechainiciotaller.setHours(hourFix);
            /* fin fix */

            this.tallerNew.idevento = this.eventoSeleccionado.ideventos;
            this.tallerNew.idtallerista = this.talleristaSelecionado.idtallerista;

            this.talleresService.guardarTaller(this.tallerNew).subscribe(
                res => {
                    this.fDisplayCreateDialog();
                    this.talleresService.obtenerTalleres().then(res => this.talleresList = res);
                    this.showMensaje('info', 'Alerta', 'Se guardó el Taller correctamente.');
                    this.tallerNew = new Talleres();
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'No se pudo guardar el Taller');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo guardar el Taller, es posible que falte un campo por llenar');
        }
    }

    editarTaller() {
        try {

            /* código para fixear la horá porque se buggea al subir y se suman 7 horas más */
            // Sí la fecha se registrá diferente (osea bien) comentar estas lineas de código 
            let hourFix = this.tallerSeleccionado.fechainiciotaller.getHours() - 7;
            this.tallerSeleccionado.fechainiciotaller.setHours(hourFix);
            /* fin fix */

            this.tallerSeleccionado.idevento = this.eventoSeleccionado.ideventos;
            this.tallerSeleccionado.idtallerista = this.talleristaSelecionado.idtallerista;

            this.talleresService.editarTaller(this.tallerSeleccionado).subscribe(
                res => {
                    this.showMensaje('info', 'Alerta', 'Se editó correctamente');
                    this.talleresService.obtenerTalleres().then(res => this.talleresList = res);
                    this.fDisplayDialogEdit(null);
                    this.tallerSeleccionado = new Talleres();
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al editar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que falte un campo');
        }
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.talleresList);
                doc.save('talleres.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.talleresList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "talleres");
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

    confirmDelete(taller: any) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar el taller: ${taller.nombretalleres} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.talleresService.borrarTaller(taller.idtalleres).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.talleresService.obtenerTalleres().then(data => this.talleresList = data);
                });
            }
        });
    }

    formatDate(date) {
        moment.locale('es');
        return moment(date).format('h:mm a');
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }
}
