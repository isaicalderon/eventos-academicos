import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Admin } from '../models/Admin';
import { Router } from '@angular/router';

const header = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class AuthService {

    _loginAdmin = "http://localhost:3000/api/login";
    _loginOperador = "http://localhost:3000/api/loginOperador";
    _loginEstudiante = "http://localhost:3000/api/loginEstudiante";
    
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    loginAdmin(admin: Admin) {
        return this.http.post(this._loginAdmin, admin, header);
    }

    loginOperador(admin: Admin) {
        return this.http.post(this._loginOperador, admin, header);
    }

    loginEstudiante(entity: Admin){
        return this.http.post(this._loginEstudiante, entity, header);
    }

    loggedIn() {
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAdmin() {
        let isAdmin = localStorage.getItem('isAdmin');
        // console.log(isAdmin);
        
        if (isAdmin == 'true') {
            return true;
        }

        return false;
    }

    isOperador() {
        let isOperador = localStorage.getItem('isOperador');
        // console.log(isAdmin);
        
        if (isOperador == 'true') {
            return true;
        }

        return false;
    }

    isEstudiante() {
        let isEstudiante = localStorage.getItem('isEstudiante');
        // console.log(isAdmin);
        
        if (isEstudiante == 'true') {
            return true;
        }

        return false;
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }



}