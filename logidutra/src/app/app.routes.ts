import { Routes } from '@angular/router';

import { PrincipalComponent } from './components/layout/principal/principal.component';
import { RomaneiosListComponent } from './components/romaneios/romaneios-list/romaneios-list.component';
import { RomaneiosDetailsComponent } from './components/romaneios/romaneios-details/romaneios-details.component';

export const routes: Routes = [
  { path: 'login', component: RomaneiosListComponent },
  {
    path: '',
    component: RomaneiosListComponent,
    children: [
      { path: 'romaneios', component: RomaneiosListComponent },
      { path: 'romaneios/:id', component: RomaneiosDetailsComponent },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
