import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Eventos } from '../models/Eventos';

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

    eventosUrl = "http://localhost:3000/api/eventosList";
    eventosAdd = "http://localhost:3000/api/guardarEvento";
    eventosEdit = "http://localhost:3000/api/editarEvento";
    eventosRemove = "http://localhost:3000/api/borrarEvento"


    obtenerEventos() {
        return this.http.get(this.eventosUrl).toPromise()
            .then(res => <Eventos[]>(res as any))
            .then(data => {
                return data;
            });;;
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
