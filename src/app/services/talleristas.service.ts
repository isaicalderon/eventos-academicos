import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tallerista } from '../models/Tallerista';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class TalleristasService {

    constructor(
        private http: HttpClient
    ) { }

    list = "http://localhost:3000/api/talleristasList";
    add = "http://localhost:3000/api/guardarTallerista";
    edit = "http://localhost:3000/api/editarTallerista";
    remove = "http://localhost:3000/api/eliminarTallerista";

    obtenerTodo() {
        return this.http.get(this.list).toPromise()
            .then(res => <Tallerista[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardar(tallerista: Tallerista) {
        return this.http.post(this.add, tallerista, header);
    }

    editar(tallerista: Tallerista) {
        return this.http.post(this.edit, tallerista, header);
    }

    eliminar(id) {
        return this.http.post(this.remove, { id: id }, header);
    }


}
