import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conferencias } from '../models/Conferencias';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class ConferenciasService {

    constructor(
        private http: HttpClient
    ) { }

    list = "http://localhost:3000/api/conferenciasList";
    add = "http://localhost:3000/api/guardarConferencia";
    edit = "http://localhost:3000/api/editarConferencia";
    del = "http://localhost:3000/api/eliminarConferencia";

    obtenerTodo() {
        return this.http.get(this.list).toPromise()
            .then(res => <Conferencias[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardar(conferencia: Conferencias) {
        return this.http.post(this.add, conferencia, header);
    }

    editar(conferencia: Conferencias) {
        return this.http.post(this.edit, conferencia, header);
    }

    eliminar(id) {
        return this.http.post(this.del, { id: id }, header);
    }


}
