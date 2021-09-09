export class Paquetes {

    idpaquetes: number;
    costopaquete: string;
    descripcionpaquete: string;
    contenidopaquete: string;
    tipopaquetes: string;
    pagospaquetes: string;

    // dto
    idevento: number;
    nombreevento: string;

    descripcionPaqueteEvento: string;
    
    constructor(){
        this.descripcionPaqueteEvento = this.descripcionpaquete+" - "+this.nombreevento;
    }


}