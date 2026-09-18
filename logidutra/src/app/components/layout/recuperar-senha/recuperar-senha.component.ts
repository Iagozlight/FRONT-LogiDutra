import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { usuario } from '../../../models/usuarios';

@Component({
  selector: 'app-recuperar-senha',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

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

    const usuariosSalvos = sessionStorage.getItem('usuarios');
    const usuariosSalvosLista = usuariosSalvos ? JSON.parse(usuariosSalvos) as usuario[] : [];
    const usuarios = [usuario.padrao(), ...usuariosSalvosLista];
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
    sessionStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
    alert('Senha atualizada com sucesso!');
  }

}
