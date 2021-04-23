import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Eventos } from 'src/app/models/Eventos';
import { Talleres } from 'src/app/models/Talleres';
import { EventosService } from 'src/app/services/eventos.service';
import { TalleresService } from 'src/app/services/talleres.service';

@Component({
    selector: 'app-talleres',
    templateUrl: './talleres.component.html',
    styleUrls: ['./talleres.component.css'],
    providers: [MessageService]
})
export class TalleresComponent implements OnInit {

    displayCreateDialog: boolean = false;

    talleresList: Talleres[];
    tallerNew: Talleres = new Talleres();

    eventosList: Eventos[];
    eventoSeleccionado: Eventos;

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private talleresService: TalleresService,
        private eventosService: EventosService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit(): void {
        this.talleresService.obtenerTalleres().then(res => this.talleresList = res);
        this.eventosService.obtenerEventos().then(res => this.eventosList = res);

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

    guardarTaller() {
        try {
            this.tallerNew.idevento = this.eventoSeleccionado.ideventos;
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
            message: `Los datos no podrán ser restaurados ¿Desea Eliminar al taller: ${taller.nombretalleres} ?`,
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

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }
}