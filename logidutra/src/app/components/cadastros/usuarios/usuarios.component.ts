import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { usuario } from '../../../models/usuarios';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  router = inject(Router);
  usuarios: usuario[] = [];
}
