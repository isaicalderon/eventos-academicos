import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventosadminComponent } from './pages/admin/eventosadmin/eventosadmin.component';
import { AuthGuard } from './auth.guard';
import { EstudiantesComponent } from './pages/admin/estudiantes/estudiantes.component';
import { TalleresComponent } from './pages/admin/talleres/talleres.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin/eventos', component: EventosadminComponent, canActivate: [AuthGuard] },
    { path: 'admin/estudiantes', component: EstudiantesComponent, canActivate: [AuthGuard] },
    { path: 'admin/talleres', component: TalleresComponent, canActivate: [AuthGuard] },
    
    { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
