import { Routes } from '@angular/router';
import { RomaneiosListComponent } from './components/romaneios/romaneios-list/romaneios-list.component';
import { RomaneiosDetailsComponent } from './components/romaneios/romaneios-details/romaneios-details.component';
import { LoginComponent } from './components/layout/login/login.component';
import { RecuperarSenhaComponent } from './components/layout/recuperar-senha/recuperar-senha.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'romaneios', component: RomaneiosListComponent },
    { path: 'romaneios/new', component: RomaneiosDetailsComponent },
    { path: 'romaneios/edit/:id', component: RomaneiosDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent },
    {
        path: 'admin',
        component: RomaneiosListComponent,
        children: [
            { path: 'romaneios', component: RomaneiosListComponent }
        ]
    },
    {
        path: 'usuario',
        component: RomaneiosListComponent,
        children: [
            { path: 'romaneios', component: RomaneiosListComponent }
        ]
    }
];
