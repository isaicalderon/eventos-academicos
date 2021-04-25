import { Component, OnInit } from '@angular/core';
import { Paquetes } from '../../../models/Paquetes';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PaquetesService } from '../../../services/paquetes.service';
import { EventosService } from '../../../services/eventos.service';
import { Eventos } from '../../../models/Eventos';

@Component({
    selector: 'app-paquetes',
    templateUrl: './paquetes.component.html',
    styleUrls: ['./paquetes.component.css'],
    providers: [MessageService]
})
export class PaquetesComponent implements OnInit {

    displayDialogAdd: boolean = false
    displayDialogEdit: boolean = false;

    paquetesList: Paquetes[];
    paqueteNew: Paquetes = new Paquetes;
    paqueteSeleccionado: Paquetes = new Paquetes;

    eventosList: Eventos[];
    eventoSeleccionado: Eventos = new Eventos();

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private paquetesService: PaquetesService,
        private eventosService: EventosService
    ) { }

    ngOnInit(): void {
        this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);
        this.eventosService.obtenerEventos().then(res => this.eventosList = res);

        this.cols = [
            { field: 'descripcionpaquete', header: 'Descripción Paquete' },
            { field: 'tipopaquetes', header: 'Tipo Paquete' },
            { field: 'costopaquete', header: 'Costo Paquete' },
            { field: 'nombreevento', header: 'Evento' }
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarPaquete() {
        try {
            this.paqueteNew.idevento = this.eventoSeleccionado.ideventos;

            this.paquetesService.guardar(this.paqueteNew).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                    this.fDisplayDialogAdd();
                    this.paqueteNew = new Paquetes();
                    this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un error al intentar guardar');
                }
            )
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo guardar el Paquete, es posible que falte un campo por llenar');
        }
    }

    editarPaquete() {
        try {
            this.paqueteSeleccionado.idevento = this.eventoSeleccionado.ideventos;

            this.paquetesService.editar(this.paqueteSeleccionado).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                    this.fDisplayDialogEdit(null);
                    this.paqueteSeleccionado = new Paquetes();
                    this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un error al intentar editar');
                }
            )
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo editar el Paquete, es posible que falte un campo por llenar');
        }
    }

    confirmDelete(paquete: Paquetes) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar el paquete: ${paquete.descripcionpaquete} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.paquetesService.eliminar(paquete.idpaquetes).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);
                });
            }
        });
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(paquete) {
        this.paqueteSeleccionado = paquete;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.paquetesList);
                doc.save('paquetes.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.paquetesList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "paquetes");
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

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

}
