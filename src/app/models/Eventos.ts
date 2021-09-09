export class Eventos {

    ideventos: number;
    nombreevento: string;
    descripcionevento: string;
    participantesevento: number;
    eventosmaxparticipantes: number;
    fechainicioevento: Date;
    fechafinevento: Date;
    idconferencias: number;
    idtalleres: number;
    fechainicioevento_ts: string;
    fechafinevento_ts: string;

    //DTO
    pagocompletado: number;
    pagosPendientes: number;

    //dto
    visitas: string;
    talleres: string;
    conferencias: string;
    
    constructor(){
        // this.fechaInicioEvento = new Date();
        // this.fechaFinEvento = new Date();
    }

}