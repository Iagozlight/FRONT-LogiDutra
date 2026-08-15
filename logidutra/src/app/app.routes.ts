import { Routes } from '@angular/router';
import { RomaneiosListComponent } from './components/romaneios/romaneios-list/romaneios-list.component';
import { RomaneiosDetailsComponent } from './components/romaneios/romaneios-details/romaneios-details.component';

export const routes: Routes = [
    { path: '', redirectTo: 'romaneios', pathMatch: 'full' },
    { path: 'romaneios', component: RomaneiosListComponent },
    { path: 'romaneios/new', component: RomaneiosDetailsComponent },
    { path: 'romaneios/edit/:id', component: RomaneiosDetailsComponent },
];
