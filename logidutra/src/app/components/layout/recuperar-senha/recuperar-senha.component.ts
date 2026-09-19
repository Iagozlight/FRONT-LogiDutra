import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario.service';

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

  enviarRecuperacao() {
    if (!this.usuario || this.usuario.trim() === '') {
      alert('Preencha o campo de Usuário!');
      return;
    }

    if (!this.novaSenha || !this.confirmarSenha) {
      alert('Preencha a nova senha e a confirmação!');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const usuarios = this.usuarioService.listarComPadrao();
    const usuarioEncontrado = usuarios.find(
      usuarioAtual => usuarioAtual.nome === this.usuario.trim()
    );

    if (!usuarioEncontrado) {
      alert('Usuário não encontrado!');
      return;
    }

    usuarioEncontrado.senha = this.novaSenha;
    const usuariosAtualizados = usuarios.filter(
      (usuarioAtual, indice, lista) => lista.findIndex(item => item.nome === usuarioAtual.nome) === indice
    );
    this.usuarioService.salvar(usuariosAtualizados.filter(usuarioAtual => usuarioAtual.nome !== usuario.padrao().nome));
    alert('Senha atualizada com sucesso!');
  }

}
