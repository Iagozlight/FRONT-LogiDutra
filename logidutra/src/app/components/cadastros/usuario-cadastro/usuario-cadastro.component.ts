import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { usuario } from '../../../models/usuarios';

@Component({
  selector: 'app-usuario-cadastro',
  imports: [MdbFormsModule, FormsModule, RouterLink],
  templateUrl: './usuario-cadastro.component.html',
  styleUrl: './usuario-cadastro.component.scss'
})
export class UsuarioCadastroComponent {
  router = inject(Router);
  usuario = new usuario(0, '', '', 0, '');
}
