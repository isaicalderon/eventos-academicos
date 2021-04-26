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

    displayDialogLogin: boolean = false;
    loginAuthError: boolean = false;

    adminLogin: Admin = new Admin();


    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // para redireccionar en caso de que entre al Home y tenga login
        if (this.verifyLogin()) {
            this.router.navigate(['/admin/eventos']);
        }
    }

    login(): void {

        this.authService.loginAdmin(this.adminLogin).subscribe(
            res => {
                this.loginAuthError = false;
                this.fDisplayDialogLogin();
                localStorage.setItem('token', res['token']);
                this.router.navigate(['/admin/eventos']);
            },
            err => this.loginAuthError = true
        );
    }

    fDisplayDialogLogin() {
        this.displayDialogLogin = !this.displayDialogLogin;
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
