import { Routes } from '@angular/router';
import { RomaneiosListComponent } from './components/romaneios/romaneios-list/romaneios-list.component';
import { RomaneiosDetailsComponent } from './components/romaneios/romaneios-details/romaneios-details.component';
import { LoginComponent } from './components/layout/login/login.component';
import { RecuperarSenhaComponent } from './components/layout/recuperar-senha/recuperar-senha.component';
import { TelaPrincipalComponent } from './components/layout/tela-principal/tela-principal.component';
import { UsuariosComponent } from './components/cadastros/usuarios/usuarios.component';
import { VeiculosComponent } from './components/cadastros/veiculos/veiculos.component';
import { RomaneioTelaPrincipalComponent } from './components/romaneios/romaneio-tela-principal/romaneio-tela-principal.component';
import { adminGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent },
    {
        path: 'admin',
        component: TelaPrincipalComponent,
        canActivate: [authGuard, adminGuard],
        children: [
            { path: 'romaneios', component: RomaneiosListComponent },
            { path: 'romaneios/new', component: RomaneiosDetailsComponent },
            { path: 'romaneios/edit/:id', component: RomaneiosDetailsComponent },
            { path: 'romaneios/:id', component: RomaneioTelaPrincipalComponent },
            {
                path: 'cadastros',
                canActivate: [adminGuard],
                children: [
                    { path: 'usuarios', component: UsuariosComponent },
                    { path: 'veiculos', component: VeiculosComponent },

                ]
            }
        ]
    },
    {
        path: 'usuario',
        component: TelaPrincipalComponent,
        canActivate: [authGuard],
        children: [
            { path: 'romaneios', component: RomaneiosListComponent },
            { path: 'romaneios/:id', component: RomaneioTelaPrincipalComponent },
            {
                path: 'cadastros',
                canActivate: [adminGuard],
                children: [
                    { path: 'usuarios', component: UsuariosComponent },
                    { path: 'veiculos', component: VeiculosComponent },

                ]
            }
        ]
    }
];
