import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Talleres } from '../models/Talleres';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class TalleresService {

    constructor(
        private http: HttpClient
    ) { }

    talleresList = "http://localhost:3000/api/talleresList";
    talleresAdd  = "http://localhost:3000/api/guardarTaller";

    obtenerTalleres() {
        return this.http.get(this.talleresList).toPromise()
            .then(res => <Talleres[]>(res as any))
            .then(data => {
                return data;
            });
    }

    guardarTaller(taller:Talleres){
        return this.http.post(this.talleresAdd, taller, header);       
    }
}
