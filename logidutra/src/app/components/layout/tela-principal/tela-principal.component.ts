import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tela-principal',
  imports: [NavBarComponent, RouterOutlet],
  templateUrl: './tela-principal.component.html',
  styleUrl: './tela-principal.component.scss'
})
export class TelaPrincipalComponent {

}
