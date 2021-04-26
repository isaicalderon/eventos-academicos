import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Tallerista } from 'src/app/models/Tallerista';
import { TalleristasService } from '../../../services/talleristas.service';

@Component({
    selector: 'app-talleristas',
    templateUrl: './talleristas.component.html',
    styleUrls: ['./talleristas.component.css'],
    providers: [MessageService]
})
export class TalleristasComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    talleristaList: Tallerista[];
    talleristaNew: Tallerista = new Tallerista();
    talleristaSeleccionado: Tallerista = new Tallerista();

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private talleristaService: TalleristasService
    ) { }

    ngOnInit(): void {
        this.talleristaService.obtenerTodo().then(res => this.talleristaList = res);

        this.cols = [
            { field: 'talleristanombre', header: 'Nombre Tallerista' },
            { field: 'talleristacorreo', header: 'Correo Tallerista' },
            { field: 'talleristatelefono', header: 'Telefono Tallerista' },
            { field: 'talleristacurriculo', header: 'Curriculo' },
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarTallerista() {
        try {
            this.talleristaService.guardar(this.talleristaNew).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                    this.fDisplayDialogAdd();
                    this.talleristaNew = new Tallerista();
                    this.talleristaService.obtenerTodo().then(res => this.talleristaList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un errro al intentar guardar');
                }
            )
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo guardar el Tallerista, es posible que falte un campo por llenar');
        }
    }

    editarTallerista() {
        try {
            this.talleristaService.editar(this.talleristaSeleccionado).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                    this.fDisplayDialogEdit(null);
                    this.talleristaSeleccionado = new Tallerista();
                    this.talleristaService.obtenerTodo().then(res => this.talleristaList = res);
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrió un errro al intentar editar');
                }
            )
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'No se pudo guardar el Tallerista, es posible que falte un campo por llenar');
        }
    }

    confirmDelete(tallerista: Tallerista) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar el taller: ${tallerista.talleristanombre} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.talleristaService.eliminar(tallerista.idtallerista).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.talleristaService.obtenerTodo().then(res => this.talleristaList = res);
                });
            }
        });
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(tallerista) {
        this.talleristaSeleccionado = tallerista;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.talleristaList);
                doc.save('tallerista.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.talleristaList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "talleristas");
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
