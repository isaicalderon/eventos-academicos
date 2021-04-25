import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paquetes } from '../models/Paquetes';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PaquetesService {

    constructor(
        private http: HttpClient
    ) { }

    list = "http://localhost:3000/api/paquetesList";
    add = "http://localhost:3000/api/guardarPaquete";
    edit = "http://localhost:3000/api/editarPaquete";
    del = "http://localhost:3000/api/eliminarPaquete";


    obtenerTodo() {
        return this.http.get(this.list).toPromise()
            .then(res => <Paquetes[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardar(paquete: Paquetes) {
        return this.http.post(this.add, paquete, header);
    }

    editar(paquete: Paquetes) {
        return this.http.post(this.edit, paquete, header);
    }

    eliminar(id: number) {
        return this.http.post(this.del, { id: id }, header);
    }


}
