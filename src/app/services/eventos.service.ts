import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Eventos } from '../models/Eventos';
import { PagosDto } from '../models/PagosDto';
import { Visitas } from '../models/Visitas';
import { Talleres } from '../models/Talleres';
import { Conferencias } from '../models/Conferencias';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class EventosService {

    constructor(
        private http: HttpClient
    ) { }

    eventosUrl      = "http://localhost:3000/api/eventosList";
    eventosAdd      = "http://localhost:3000/api/guardarEvento";
    eventosEdit     = "http://localhost:3000/api/editarEvento";
    eventosRemove   = "http://localhost:3000/api/borrarEvento"
    _misEventos     = "http://localhost:3000/api/misEventos/"
    _misVisitas     = "http://localhost:3000/api/misEventos/visitas/"
    _misTalleres    = "http://localhost:3000/api/misEventos/talleres/"
    _misConferen    = "http://localhost:3000/api/misEventos/conferencias/"
    _misPagos       = "http://localhost:3000/api/misPagos/"


    obtenerEventos() {
        return this.http.get(this.eventosUrl).toPromise()
            .then(res => <Eventos[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerMisPagos(idEstudiante: number) {
        return this.http.get(this._misPagos + idEstudiante).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerMisEventos(idEstudiante: number) {
        return this.http.get(this._misEventos + idEstudiante).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerMisVisitas(idevento: number) {
        return this.http.get(this._misVisitas + idevento).toPromise()
            .then(res => <Visitas[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerMisTalleres(idevento: number) {
        return this.http.get(this._misTalleres + idevento).toPromise()
            .then(res => <Talleres[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerMisConferencias(idevento: number) {
        return this.http.get(this._misConferen + idevento).toPromise()
            .then(res => <Conferencias[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardarEvento(evento: Eventos) {
        return this.http.post(this.eventosAdd, evento, header);
    }

    editarEvento(evento: Eventos) {
        return this.http.post(this.eventosEdit, evento, header);
    }

    borrarEvento(idevento) {
        return this.http.post(this.eventosRemove, { id: idevento }, header);
    }



}
