import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Estudiante } from '../../../models/Estudiante';
import { EstudianteService } from '../../../services/estudiante.service';
import { Paquetes } from '../../../models/Paquetes';
import { PaquetesService } from '../../../services/paquetes.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-estudiantes',
    templateUrl: './estudiantes.component.html',
    styleUrls: ['./estudiantes.component.css'],
    providers: [MessageService]
})
export class EstudiantesComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    estudiantesList: Estudiante[];
    estudianteNew: Estudiante = new Estudiante();
    estudianteSeleccionado: Estudiante = new Estudiante();

    paquetesList: Paquetes[];
    paqueteSeleccionado: Paquetes = new Paquetes();

    cols: any[];
    exportColumns: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private estudianteService: EstudianteService,
        private paquetesService: PaquetesService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.estudianteService.obtenerEstudiantes().then(data => this.estudiantesList = data);
        this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);

        this.cols = [
            { field: 'matriculaestudiantes', header: 'Matricula' },
            { field: 'nombreestudiantes', header: 'Nombres' },
            { field: 'apellidosestudiante', header: 'apellidos' },
            { field: 'correoestudiantes', header: 'Correo' },
            { field: 'idpaquetes', header: 'Paquete' },
        ];

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    fDisplayDialogAdd(): void {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(estudiante: Estudiante): void {
        this.estudianteSeleccionado = estudiante;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    guardarEstudiante() {
        try {
            this.estudianteNew.idpaquetes = this.paqueteSeleccionado.idpaquetes;
            
            this.estudianteService.guardarEstudiante(this.estudianteNew).subscribe(
                res => {
                    this.fDisplayDialogAdd();
                    this.estudianteService.obtenerEstudiantes().then(data => this.estudiantesList = data);
                    this.estudianteNew = new Estudiante();
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'No se pudo registrar al estudiante.');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que un campo este vacío');
        }
    }

    editarEstudiante() {
        try {
            this.estudianteSeleccionado.idpaquetes = this.paqueteSeleccionado.idpaquetes;

            this.estudianteService.editarEstudiante(this.estudianteSeleccionado).subscribe(
                res => {
                    this.fDisplayDialogEdit(null);
                    this.estudianteSeleccionado = new Estudiante();
                    this.estudianteService.obtenerEstudiantes().then(data => this.estudiantesList = data);
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al editar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que un campo este vacío');
        }
    }

    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.estudiantesList);
                doc.save('estudiantes.pdf');
            })
        })
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.estudiantesList);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "estudiantes");
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

    confirmDelete(evento: any) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea Eliminar al estudiante: ${evento.nombreestudiantes} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.estudianteService.borrarEstudiante(evento.idestudiantes).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.estudianteService.obtenerEstudiantes().then(data => this.estudiantesList = data);
                });
            }
        });
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

    isAdmin() {
        return this.authService.isAdmin();
    }

    generarPassword(){
        let lenghtX = 5;
		let characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let charactersLength: number = characters.length;
		let randomString = '';
        
        for (var i = 0; i < lenghtX; i++) {
			randomString += characters[ Math.floor(Math.random() * (charactersLength - 1))];
		}

		this.estudianteNew.passwordestudiante = randomString;
	}


}
