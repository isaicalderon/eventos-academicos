export class PagosDto {

    idpagos: number;
    idpaquete: number;
    pagoimage: string;
    estadopago: string;
    fechapago: Date;

    //estudiante DTO
    idestudiante: number;
    matriculaestudiantes: number;
    nombreestudiantes: string;
    apellidosestudiante: string;
    
    //eventosDTO
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

    //paquetesDTO
    idpaquetes: number;
    costopaquete: string;
    descripcionpaquete: string;
    contenidopaquete: string;
    tipopaquetes: string;
    pagospaquetes: string;

    //dto
    visitas: string;
    talleres: string;



}