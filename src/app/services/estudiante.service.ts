import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudiante } from '../models/Estudiante';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class EstudianteService {

    constructor(
        private http: HttpClient
    ) { }

    list = "http://localhost:3000/api/estudiantesList";
    add = "http://localhost:3000/api/guardarEstudiante";
    remove = "http://localhost:3000/api/eliminarEstudiante";
    edit = "http://localhost:3000/api/editarEstudiante";

    obtenerEstudiantes() {
        return this.http.get(this.list).toPromise()
            .then(res => <Estudiante[]>(res as any))
            .then(data => {
                return data;
            });;
    }

    guardarEstudiante(estudiante: Estudiante) {
        return this.http.post(this.add, estudiante, header);
    }

    borrarEstudiante(id) {
        return this.http.post(this.remove, { id: id }, header);
    }

    editarEstudiante(estudiante: any) {
        return this.http.post(this.edit, estudiante, header);
    }

}
