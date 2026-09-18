import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  rotaAtual = inject(ActivatedRoute);
  usuario = new usuario(0, '', '', 0, '');

  cadastrar() {
    if (!this.usuario.nome.trim() || !this.usuario.senha || !this.usuario.role) {
      alert('Preencha nome, senha e role!');
      return;
    }

    const usuariosSalvos = sessionStorage.getItem('usuarios');
    const usuarios: usuario[] = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];

    if ([usuario.padrao(), ...usuarios].some(usuarioAtual => usuarioAtual.nome === this.usuario.nome.trim())) {
      alert('Esse usuário já existe!');
      return;
    }


    this.usuario.nome = this.usuario.nome.trim();
    const todosUsuarios = [usuario.padrao(), ...usuarios];
    this.usuario.id = todosUsuarios.length > 0
      ? Math.max(...todosUsuarios.map(usuarioAtual => usuarioAtual.id)) + 1
      : 1;
    this.usuario.Disp = false;
    usuarios.push(this.usuario);
    sessionStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.router.navigate(['../usuarios'], { relativeTo: this.rotaAtual });
  }
}
