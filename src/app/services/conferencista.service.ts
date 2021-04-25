import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conferencista } from '../models/Conferencista';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class ConferencistaService {

    constructor(
        private http: HttpClient
    ) { }

    list = "http://localhost:3000/api/conferencistaList";
    add = "http://localhost:3000/api/guardarConferencista";
    edit = "http://localhost:3000/api/editarConferencista";
    del = "http://localhost:3000/api/eliminarConferencista";


    obtenerLista() {
        return this.http.get(this.list).toPromise()
            .then(res => <Conferencista[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardar(conferencista: Conferencista) {
        return this.http.post(this.add, conferencista, header);
    }

    editar(conferencista: Conferencista) {
        return this.http.post(this.edit, conferencista, header);
    }

    delete(id) {
        return this.http.post(this.del, { id: id }, header);
    }



}
