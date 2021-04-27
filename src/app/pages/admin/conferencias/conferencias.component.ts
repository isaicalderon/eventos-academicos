import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConferenciasService } from '../../../services/conferencias.service';
import { Conferencias } from '../../../models/Conferencias';
import { Eventos } from '../../../models/Eventos';
import { EventosService } from '../../../services/eventos.service';
import { ConferencistaService } from '../../../services/conferencista.service';
import { Conferencista } from 'src/app/models/Conferencista';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-conferencias',
    templateUrl: './conferencias.component.html',
    styleUrls: ['./conferencias.component.css'],
    providers: [MessageService]
})
export class ConferenciasComponent implements OnInit {

    displayDialogAdd: boolean = false;
    displayDialogEdit: boolean = false;

    conferenciasList: Conferencias[];
    conferenciaNew: Conferencias = new Conferencias();
    conferenciaSeleccionada: Conferencias = new Conferencias();

    eventosList: Eventos[];
    eventoSeleccionado: Eventos = new Eventos();
    conferencistasList: Conferencista[];
    conferencistaSeleccionado: Conferencista = new Conferencista();

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private conferenciasService: ConferenciasService,
        private eventosService: EventosService,
        private conferencistaService: ConferencistaService,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.conferenciasService.obtenerTodo().then(res => this.conferenciasList = res);
        this.eventosService.obtenerEventos().then(res => this.eventosList = res);
        this.conferencistaService.obtenerLista().then(res => this.conferencistasList = res);
    }


    guardarConferencia() {
        try {
            this.conferenciaNew.idevento = this.eventoSeleccionado.ideventos;
            this.conferenciaNew.idconferencista = this.conferencistaSeleccionado.idconferencista;

            this.conferenciasService.guardar(this.conferenciaNew).subscribe(
                res => {
                    this.fDisplayDialogAdd();
                    this.conferenciaNew = new Conferencias();
                    this.showMensaje('info', 'Mensaje', 'Se guardó correctamente');
                    this.conferenciasService.obtenerTodo().then(res => this.conferenciasList = res);

                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al intentar guardar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que falte un campo por llenar');
        }
    }

    editarConferencia() {
        try {
            this.conferenciaSeleccionada.idevento = this.eventoSeleccionado.ideventos;
            this.conferenciaSeleccionada.idconferencista = this.conferencistaSeleccionado.idconferencista;

            this.conferenciasService.editar(this.conferenciaSeleccionada).subscribe(
                res => {
                    this.fDisplayDialogEdit(null);
                    this.conferenciaSeleccionada = new Conferencias();
                    this.showMensaje('info', 'Mensaje', 'Se editó correctamente');
                    this.conferenciasService.obtenerTodo().then(res => this.conferenciasList = res);

                },
                err => {
                    this.showMensaje('error', 'Alerta', 'Ocurrio un error al intentar editar');
                }
            );
        } catch (error) {
            this.showMensaje('warn', 'Alerta', 'Es posible que falte un campo por llenar');
        }
    }

    confirmDelete(conferencia: any) {
        this.confirmationService.confirm({
            message: `Los datos no podrán ser restaurados ¿Desea Eliminar la conferencia: ${conferencia.nombreconferencia} ?`,
            acceptLabel: 'Sí',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            defaultFocus: 'reject',
            accept: () => {
                this.conferenciasService.eliminar(conferencia.idconferencias).subscribe(res => {
                    this.showMensaje('success', 'Mensaje', 'Se eliminó correctamente.');
                    this.conferenciasService.obtenerTodo().then(res => this.conferenciasList = res);
                });
            }
        });
    }

    fDisplayDialogAdd() {
        this.displayDialogAdd = !this.displayDialogAdd;
    }

    fDisplayDialogEdit(conferencia) {
        this.conferenciaSeleccionada = conferencia;
        this.displayDialogEdit = !this.displayDialogEdit;
    }

    formatDate(date) {
        moment.locale('es');
        return moment(date).format('DD/MM/yy h:mm:ss a');
    }

    showMensaje(severity, summary, details) {
        this.messageService.add({ severity: severity, summary: summary, detail: details });
    }

    isAdmin() {
        return this.authService.isAdmin();
    }
}
