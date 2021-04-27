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

    _loginAdmin = "http://localhost:3000/api/login"
    _loginOperador = "http://localhost:3000/api/loginOperador"

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

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }



}