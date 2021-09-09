import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../../models/Admin';
import { AuthService } from '../../services/auth.service';
import { Estudiante } from '../../models/Estudiante';
import { EventosService } from '../../services/eventos.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    displayDialogLogin: boolean = false;
    displayDialogLoginEst: boolean = false;
    loginAuthError: boolean = false;
    displaySidebarEstudiante: boolean = false;
    displaySidebarAdmin: boolean = false;


    adminLogin: Admin = new Admin();
    estudianteLogin: Estudiante = new Estudiante();
    
    checkAdmin: boolean;

    constructor(
        private authService: AuthService,
        private eventosService: EventosService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('estudianteLogin')) {
            this.estudianteLogin = JSON.parse(localStorage.getItem('estudianteLogin'));
            // let idEstudiante = this.estudianteLogin.idestudiantes;
            // this.eventosService.obtenerMisEventos(idEstudiante).then(
            //     res => {
            //         this.misEventosList = res;
            //     }
            // );

        }
    }

    login(): void {
        if (this.checkAdmin) {
            this.authService.loginAdmin(this.adminLogin).subscribe(
                res => {
                    this.loginAuthError = false;
                    this.fDisplayDialogLogin();
                    localStorage.setItem('token', res['token']);
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('isOperador', 'false');
                    localStorage.setItem('isEStudiante', 'false');

                    this.router.navigate(['/admin/eventos']);
                },
                err => this.loginAuthError = true
            );
        } else {
            this.authService.loginOperador(this.adminLogin).subscribe(
                res => {
                    this.loginAuthError = false;
                    this.fDisplayDialogLogin();
                    localStorage.setItem('token', res['token']);
                    localStorage.setItem('isAdmin', 'false');
                    localStorage.setItem('isOperador', 'true');
                    localStorage.setItem('isEStudiante', 'false');
                    this.router.navigate(['/admin/eventos']);
                },
                err => this.loginAuthError = true
            );
        }
    }

    loginEstudiante(): void {
        this.authService.loginEstudiante(this.adminLogin).subscribe(
            res => {
                this.loginAuthError = false;
                this.fDisplayDialogLoginEst();
                localStorage.setItem('token', res['token']);
                localStorage.setItem('isAdmin', 'false');
                localStorage.setItem('isOperador', 'false');
                localStorage.setItem('isEstudiante', 'true');
                let estudiante = res['result'];
                // console.log(estudiante[0]);
                
                localStorage.setItem('estudianteLogin', JSON.stringify(estudiante[0]));
                
                this.router.navigate(['estudiante/dashboard']);
            },
            err => this.loginAuthError = true
        );
    }

    displaySidebarOnLogin(){
        // desicidir que sidebar abrir
        this.displaySidebarEstudiante = true;
    }

    fDisplayDialogLogin() {
        this.displayDialogLogin = !this.displayDialogLogin;
    }

    fDisplayDialogLoginEst() {
        this.displayDialogLoginEst = !this.displayDialogLoginEst;
    }

    verifyLogin() {
        return this.authService.loggedIn();
    }

    verifyAdmin() {
        return this.authService.isAdmin();
    }

    verifyOperador(){
        return this.authService.isOperador();
    }

    logout() {
        this.authService.logout();
    }

    activeAdminNav(active: boolean): void {
        var menu_btn = document.querySelector("#menu-btn")
        var sidebar = document.querySelector("#sidebar")
        var container = document.querySelector(".my-container")

        if (active) {
            sidebar.classList.toggle("active-nav")
            container.classList.toggle("active-cont")
        }
    }

}
