import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-cadastro',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './usuario-cadastro.component.html',
  styleUrl: './usuario-cadastro.component.scss'
})
export class UsuarioCadastroComponent {
  router = inject(Router);
  rotaAtual = inject(ActivatedRoute);
  usuario = new usuario(0, '', '', 0, '');
  usuarioService = inject(UsuarioService);

  cadastrar() {
    if (!this.usuario.nome.trim() || !this.usuario.senha || !this.usuario.role) {
      alert('Preencha nome, senha e role!');
      return;
    }

    const usuarios = this.usuarioService.listar();

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
    this.usuarioService.adicionar(this.usuario);
    this.router.navigate(['/admin/cadastros/usuarios']);
  }

  voltar() {
    this.router.navigate(['/admin/cadastros/usuarios']);
  }
}
