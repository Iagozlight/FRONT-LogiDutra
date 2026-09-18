import { Routes } from '@angular/router';
import { RomaneiosListComponent } from './components/romaneios/romaneios-list/romaneios-list.component';
import { RomaneiosDetailsComponent } from './components/romaneios/romaneios-details/romaneios-details.component';
import { LoginComponent } from './components/layout/login/login.component';
import { RecuperarSenhaComponent } from './components/layout/recuperar-senha/recuperar-senha.component';
import { TelaPrincipalComponent } from './components/layout/tela-principal/tela-principal.component';
import { UsuariosComponent } from './components/cadastros/usuarios/usuarios.component';
import { MotoristasComponent } from './components/cadastros/motoristas/motoristas.component';
import { VeiculosComponent } from './components/cadastros/veiculos/veiculos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'romaneios', component: RomaneiosListComponent },
    { path: 'romaneios/new', component: RomaneiosDetailsComponent },
    { path: 'romaneios/edit/:id', component: RomaneiosDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent },
    {
        path: 'admin',
        component: TelaPrincipalComponent,
        children: [
            { path: 'romaneios', component: RomaneiosListComponent },
            { path: 'cadastros/usuarios', component: UsuariosComponent },
            { path: 'cadastros/motoristas', component: MotoristasComponent },
            { path: 'cadastros/veiculos', component: VeiculosComponent }
        ]
    },
    {
        path: 'usuario',
        component: TelaPrincipalComponent,
        children: [
            { path: 'romaneios', component: RomaneiosListComponent },
            { path: 'cadastros/usuarios', component: UsuariosComponent },
            { path: 'cadastros/motoristas', component: MotoristasComponent },
            { path: 'cadastros/veiculos', component: VeiculosComponent }
        ]
    }
];
