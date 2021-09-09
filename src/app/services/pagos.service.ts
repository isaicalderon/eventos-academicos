import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PagosDto } from '../models/PagosDto';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PagosService {

    constructor(private http: HttpClient) { }

    list = "http://localhost:3000/api/pagosList";
    add = "http://localhost:3000/api/guardarPago";
    del = "http://localhost:3000/api/eliminarPago";
    estado = "http://localhost:3000/api/cambiarEstado";

    pagosComple = "http://localhost:3000/api/pagosByEvento/completado/";
    pagosPendie = "http://localhost:3000/api/pagosByEvento/pendiente/";
    pagosEvento = "http://localhost:3000/api/pagosByEvento/";


    obtenerTodo() {
        return this.http.get(this.list).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerPagosByIdEvento(idEvento: number) {
        return this.http.get(this.pagosEvento + idEvento).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerPagosCompletados(idEvento: number) {
        return this.http.get(this.pagosComple + idEvento).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }

    obtenerPagosPendientes(idEvento: number) {
        return this.http.get(this.pagosPendie + idEvento).toPromise()
            .then(res => <PagosDto[]>(res as any))
            .then(data => {
                return data;
            });
    }


    guardar(pago: PagosDto) {
        return this.http.post(this.add, pago, header);
    }

    eliminar(id: number) {
        return this.http.post(this.del, { id: id }, header);
    }

    cambiarEstado(pago: PagosDto) {
        return this.http.post(this.estado, pago, header);
    }

}
