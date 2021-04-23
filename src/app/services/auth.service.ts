import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Admin } from '../models/Admin';
import { Router } from '@angular/router';

const header = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

@Injectable({providedIn:'root'})
export class AuthService{

    private loginUrl = "http://localhost:3000/api/login"
    
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }


    loginAdmin(admin: Admin){
        return this.http.post(this.loginUrl, admin, header);
    }

    loggedIn(){
        return !!localStorage.getItem('token');
    }

    getToken(){
        return localStorage.getItem('token');
    }

    logout(){
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }



}