import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { RecuperarSenhaComponent } from './components/layout/recuperar-senha/recuperar-senha.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent }
    // {
    //     path: 'admin',
    //     component: RomaneiosListComponent,
    //     children: [
    //         { path: 'romaneios', component: RomaneiosListComponent }
    //     ]
    // }
];
