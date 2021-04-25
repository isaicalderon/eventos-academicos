import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Conferencista } from '../../../models/Conferencista';
import { ConferencistaService } from '../../../services/conferencista.service';

@Component({
    selector: 'app-conferencista',
    templateUrl: './conferencista.component.html',
    styleUrls: ['./conferencista.component.css'],
    providers: [MessageService]
})
export class ConferencistaComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    conferencistasList: Conferencista[];
    conferencistaNew: Conferencista = new Conferencista();
    conferencistaSeleccionado: Conferencista = new Conferencista();

    sexoList: any;

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private conferencistaService: ConferencistaService
    ) { }

    ngOnInit(): void {
        this.conferencistaService.obtenerLista().then(res => this.conferencistasList = res);

        this.sexoList = [
            { value: 'Masculino' },
            { value: 'Femenino' }
        ];

        this.cols = [
            { field: 'conferencistanombre', header: 'Nombre Conferencista' },
            { field: 'conferencistacorreo', header: 'Correo COnferencista' },
            { field: 'conferencistatelefono', header: 'Telefono' },
            { field: 'conferencistaprofesion', header: 'Profesión' },
            { field: 'conferencistasexo', header: 'Sexo Conferencista' },
            { field: 'conferencistaedad', header: 'Edad Conferencista' }
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarConferencista() {
        try {
            this.conferencistaService.guardar(this.conferencistaNew).subscribe(
                res => {
                    this.fDisplayDialogAdd();
                    this.conferencistaNew = new Conferencista();
                    this.conferencistaService.obtenerLista().then(res => this.conferencistasList = res);
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al intentar guardar.');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que falte un campo por llenar');
        }
    }

    editarConferencista() {
        try {
            this.conferencistaService.editar(this.conferencistaSeleccionado).subscribe(
                res => {
                    this.fDisplayDialogEdit(null);
                    this.conferencistaSeleccionado = new Conferencista();
                    this.conferencistaService.obtenerLista().then(res => this.conferencistasList = res);
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al intentar editar.');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que falte un campo por llenar');
        }
    }

    confirmDelete(conf: Conferencista) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar al conferencista: ${conf.conferencistanombre} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.conferencistaService.delete(conf.idconferencista).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.conferencistaService.obtenerLista().then(res => this.conferencistasList = res);
                });
            }
        });
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(conferencista) {
        this.conferencistaSeleccionado = conferencista;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.conferencistasList);
                doc.save('conferencistas.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.conferencistasList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "conferencistas");
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
