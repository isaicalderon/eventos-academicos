import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // para redireccionar en caso de que entre al Home y tenga login
        if (this.verifyLogin()) {

            if (this.authService.isAdmin() || this.authService.isOperador()) {
                this.router.navigate(['/admin/eventos']);
                return;
            }

            if (this.authService.isEstudiante()) {
                this.router.navigate(['/estudiante']);
            }

        }
    }

    verifyLogin() {
        return this.authService.loggedIn();
    }

}
