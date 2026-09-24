import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';

import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario-service.service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  usuarioService = inject(UsuarioService);

  usuario!: string;
  novaSenha!: string;
  confirmarSenha!: string;

  enviarRecuperacao(): void {

    if (!this.usuario || this.usuario.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Preencha o campo de usuário.'
      });
      return;
    }

    if (!this.novaSenha || !this.confirmarSenha) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Preencha a nova senha e a confirmação.'
      });
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'As senhas não coincidem.'
      });
      return;
    }

    const nomeUsuario = this.usuario.trim();

    this.usuarioService.login(nomeUsuario, this.novaSenha).subscribe({
      next: () => {
        // ...
      },
      error: () => {
        // ...
      }
    });
  }
}
