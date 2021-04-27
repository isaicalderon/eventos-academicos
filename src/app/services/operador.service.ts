import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Operador } from '../models/Operador';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class OperadorService {

    constructor(
        private http: HttpClient
    ) { }

    list    = "http://localhost:3000/api/operadoresList";
    add     = "http://localhost:3000/api/guardarOperador";
    edit    = "http://localhost:3000/api/editarOperador";
    del     = "http://localhost:3000/api/eliminarOperador";


    obtenerTodo() {
        return this.http.get(this.list).toPromise()
            .then(res => <Operador[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardar(operador: Operador) {
        return this.http.post(this.add, operador, header);
    }

    editar(operador: Operador) {
        return this.http.post(this.edit, operador, header);
    }

    eliminar(id: number) {
        return this.http.post(this.del, { id: id }, header);
    }

}
