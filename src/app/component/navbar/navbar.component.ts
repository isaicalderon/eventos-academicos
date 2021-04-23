import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../../models/Admin';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    adminLogin: Admin = new Admin();
    loginAuthError: boolean = false;


    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    login(): void {
        var myModal = document.getElementById('inicia-s');
        var blur = document.getElementsByClassName('modal-backdrop');

        this.authService.loginAdmin(this.adminLogin).subscribe(
            res => {
                this.loginAuthError = false;
                myModal.classList.remove('show');
                blur[0].classList.remove('show');
                localStorage.setItem('token', res['token']);
                this.router.navigate(['/admin/eventos'])
            },
            err => this.loginAuthError = true
        );
    }

    verifyLogin() {
        return this.authService.loggedIn();
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
