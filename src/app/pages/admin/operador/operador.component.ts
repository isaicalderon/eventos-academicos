import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Operador } from '../../../models/Operador';
import { OperadorService } from '../../../services/operador.service';

@Component({
    selector: 'app-operador',
    templateUrl: './operador.component.html',
    styleUrls: ['./operador.component.css'],
    providers: [MessageService]
})
export class OperadorComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    operadoresList: Operador[];
    operadorNew: Operador = new Operador();
    operadorSeleccionado = new Operador();

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private operadoresService: OperadorService
    ) { }

    ngOnInit(): void {
        this.operadoresService.obtenerTodo().then(res => this.operadoresList = res);

        this.cols = [
            { field: 'usernameoperador', header: 'Username Operador' },
            { field: 'passwordoperador', header: 'Contraseá Operador' },
            { field: 'nombreoperador', header: 'Nombre operador' }
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    guardarOperador() {
        try {
            this.operadoresService.guardar(this.operadorNew).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                    this.fDisplayDialogAdd();
                    this.operadorNew = new Operador();
                    this.operadoresService.obtenerTodo().then(res => this.operadoresList = res);
                },
                err => {
                    this.showMensaje('error', 'Mensaje', 'Ocurrió un error al intentar guardar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Mensaje', 'No se pudo guardar');
        }
    }

    editarOperador() {
        try {
            this.operadoresService.editar(this.operadorSeleccionado).subscribe(
                res => {
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                    this.fDisplayDialogEdit(null);
                    this.operadorSeleccionado = new Operador();
                    this.operadoresService.obtenerTodo().then(res => this.operadoresList = res);
                },
                err => {
                    this.showMensaje('error', 'Mensaje', 'Ocurrió un error al intentar editar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Mensaje', 'No se pudo editar');
        }
    }

    confirmDelete(operador: Operador) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea eliminar el operador: ${operador.nombreoperador} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.operadoresService.eliminar(operador.idoperador).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.operadoresService.obtenerTodo().then(res => this.operadoresList = res);
                });
            }
        });
    }   

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(operador: Operador) {
        this.operadorSeleccionado = operador;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.operadoresList);
                doc.save('operadores.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.operadoresList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "operadores");
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
