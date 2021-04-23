import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { EventosadminComponent } from './pages/admin/eventosadmin/eventosadmin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { EstudiantesComponent } from './pages/admin/estudiantes/estudiantes.component';
import { NavbarAdminComponent } from './component/navbar-admin/navbar-admin.component';
import { TalleresComponent } from './pages/admin/talleres/talleres.component';

//primeng
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api'; 
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        EventosadminComponent,
        EstudiantesComponent,
        NavbarAdminComponent,
        TalleresComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        NgbModule,

        AccordionModule,
        TableModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextareaModule,
        CalendarModule,
        ToastModule,
        DropdownModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        ConfirmationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }