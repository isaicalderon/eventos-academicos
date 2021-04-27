import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar-admin',
    templateUrl: './navbar-admin.component.html',
    styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit(): void {
    }

    getRolLogin() {
        if (this.authService.isAdmin()) {
            return "Administrador";
        } else {
            return "Operador";
        }
    }

    isAdmin() {
        return this.authService.isAdmin();
    }

}
