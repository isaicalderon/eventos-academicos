import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Visitas } from '../models/Visitas';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
	providedIn: 'root'
})
export class VisitasService {

	constructor(
		private http: HttpClient
	) { }

	list = "http://localhost:3000/api/visitasList";
	add = "http://localhost:3000/api/guardarVisita";
	edit = "http://localhost:3000/api/editarVisita";
	remove = "http://localhost:3000/api/eliminarVisita";

	obtenerTodo() {
		return this.http.get(this.list).toPromise()
			.then(res => <Visitas[]>(res as any))
			.then(data => {
				return data;
			});
	}

	guardar(visita: Visitas) {
		return this.http.post(this.add, visita, header);
	}

	editar(visita: Visitas) {
		return this.http.post(this.edit, visita, header);
	}

	eliminar(id) {
		return this.http.post(this.remove, { id: id }, header);
	}
}
