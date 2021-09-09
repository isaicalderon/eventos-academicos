import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/models/Estudiante';
import { Eventos } from '../../../models/Eventos';
import { EventosService } from '../../../services/eventos.service';
import { PagosDto } from '../../../models/PagosDto';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { Visitas } from '../../../models/Visitas';
import { Talleres } from '../../../models/Talleres';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    displayDialogInfo: boolean = false;

    misEventosList: PagosDto[];

    misVisitas: Visitas[];
    misTalleres: Talleres[];

    eventoSeleccionado: PagosDto = new PagosDto();

    estudianteLogin: Estudiante = new Estudiante();
    
    menuBar: MenuItem[];

    constructor(
        private eventosService: EventosService
    ) { }

    ngOnInit(): void {

        if (localStorage.getItem('estudianteLogin')) {
            this.estudianteLogin = JSON.parse(localStorage.getItem('estudianteLogin'));
            let idEstudiante = this.estudianteLogin.idestudiantes;
            this.eventosService.obtenerMisEventos(idEstudiante).then(
                res => {
                    this.misEventosList = res;
                }
            );
        }

        this.menuBar = [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/estudiante']
            },
            {
                label: 'Pagos',
                icon: 'pi pi-fw pi-dollar',
                routerLink: ['/estudiante/pagos']
            }
        ];
    }

    fDisplayDialogInfo(evento): void {
        this.eventoSeleccionado = evento;
        this.eventosService.obtenerMisVisitas(this.eventoSeleccionado.ideventos).then(
            res => {
                this.misVisitas = res;
                let visitas: string = "";
                for (var i = 0; i < this.misVisitas.length; i++) {
                    visitas += (i + 1) + ". " + this.misVisitas[i].visitanombre + ", \n";
                }
                this.eventoSeleccionado.visitas = visitas;
            }
        );

        this.eventosService.obtenerMisTalleres(this.eventoSeleccionado.ideventos).then(
            res => {
                this.misTalleres = res;
                let talleres: string = "";
                for (var i = 0; i < this.misTalleres.length; i++) {
                    talleres += (i + 1) + ". " + this.misTalleres[i].nombretalleres + ", \n";
                }
                this.eventoSeleccionado.talleres = talleres;
            }
        )

        this.displayDialogInfo = !this.displayDialogInfo;
    }

    verificarEstado(evento: Eventos) {
        let fechaActual = new Date();
        let currentTimestamp: number = fechaActual.getTime();
        let eventoTimestampInicial: number = parseInt(evento.fechainicioevento_ts);
        let eventoTimestampFinal: number = parseInt(evento.fechafinevento_ts);


        if (currentTimestamp < eventoTimestampFinal) {
            if (currentTimestamp > eventoTimestampInicial) {
                return "iniciado";
            } else {
                // un calculo mas
            }
        } else {
            return "finalizado";
        }

        return "activo";
    }

    formatDate(date) {
        moment.locale('es');
        var date2 = new Date(date * 1);
        // return date2.toLocaleString();
        return moment(date2).format('DD/MM/yy h:mm:s a');
    }

}
