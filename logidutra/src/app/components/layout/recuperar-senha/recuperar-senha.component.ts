import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';


import { UsuarioService } from '../../../services/usuario-service.service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  usuario = '';
  novaSenha = '';
  confirmarSenha = '';
  carregando = false;

  enviarRecuperacao(): void {


    if (!this.usuario || this.usuario.trim() === '') {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha o campo de usuário.' });
      return;
    }

    if (!this.novaSenha || !this.confirmarSenha) {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha a nova senha e a confirmação.' });
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'As senhas não coincidem.' });
      return;
    }

    const nomeUsuario = this.usuario.trim();
    this.carregando = true;

    this.usuarioService.redefinirSenha(nomeUsuario, this.novaSenha).subscribe({
      next: () => {
        this.carregando = false;
        Swal.fire({
          icon: 'success',
          title: 'Senha alterada!',
          text: 'Sua senha foi redefinida com sucesso.',
          confirmButtonText: 'Ir para o Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (erro) => {
        this.carregando = false;
        const mensagem = typeof erro?.error === 'string' ? erro.error : 'Não foi possível redefinir a senha.';
        Swal.fire({ icon: 'error', title: 'Erro', text: mensagem });
      }
    });
  }
}
