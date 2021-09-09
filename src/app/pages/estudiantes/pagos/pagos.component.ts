import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PagosDto } from '../../../models/PagosDto';
import { EventosService } from '../../../services/eventos.service';
import { Estudiante } from '../../../models/Estudiante';
import * as moment from 'moment';
import { Paquetes } from '../../../models/Paquetes';
import { PaquetesService } from '../../../services/paquetes.service';
import { PagosService } from '../../../services/pagos.service';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css'],
    providers: [MessageService]
})
export class PagosComponent implements OnInit {

    displayDialogAdd: boolean = false;

    paquetesList: Paquetes[];
    paqueteSeleccionado: Paquetes = new Paquetes();

    misPagosList: PagosDto[];
    estudianteLogin: Estudiante = new Estudiante();

    menuBar: MenuItem[];

    uploadedFiles: any[] = [];

    constructor(
        private eventosService: EventosService,
        private paquetesService: PaquetesService,
        private pagosService: PagosService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.paquetesService.obtenerTodo().then(res => { this.paquetesList = res; console.log(this.paquetesList) });

        if (localStorage.getItem('estudianteLogin')) {
            this.estudianteLogin = JSON.parse(localStorage.getItem('estudianteLogin'));
            let idEstudiante = this.estudianteLogin.idestudiantes;
            this.eventosService.obtenerMisPagos(idEstudiante).then(res => this.misPagosList = res);
        }

        this.menuBar = [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',
                routerLink: ['estudiante']
            },
            {
                label: 'Pagos',
                icon: 'pi pi-fw pi-dollar',
                routerLink: ['estudiante/pagos']
            }
        ];
    }

    guardarPago() {
        let pago: PagosDto = new PagosDto();
        pago.idestudiante = this.estudianteLogin.idestudiantes;
        pago.idpaquete = this.paqueteSeleccionado.idpaquetes;
        pago.estadopago = "pendiente";
        pago.fechapago = new Date();

        this.pagosService.guardar(pago).subscribe(
            res => {
                this.fDisplayDialogAdd();
                this.paqueteSeleccionado = new Paquetes();
                this.eventosService.obtenerMisPagos(this.estudianteLogin.idestudiantes).then(res => this.misPagosList = res);
            }
        )
    }

    fDisplayDialogAdd(): void {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    formatDate(date) {
        moment.locale('es');
        // var date2 = new Date(date);
        // return date2.toLocaleString();
        return moment(date).format('DD/MM/yy');
    }

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

}
