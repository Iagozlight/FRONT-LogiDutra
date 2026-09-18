import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { usuario } from '../../../models/usuarios';


@Component({
  selector: 'app-login',
  imports: [MdbCollapseModule, MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  usuario!: string;
  senha!: string;
  lembrarUsuario: boolean = false;
  usuarios: usuario[] = [usuario.padrao()];

  router = inject(Router);

  logar() {
    const usuariosSalvos = sessionStorage.getItem('usuarios');
    const usuarios = usuariosSalvos ? JSON.parse(usuariosSalvos) as usuario[] : [];
    const todosUsuarios = [...usuarios, ...this.usuarios].filter(
      (usuarioAtual, indice, lista) => lista.findIndex(item => item.nome === usuarioAtual.nome) === indice
    );
    const usuarioEncontrado = todosUsuarios.find(
      usuario => usuario.nome === this.usuario && usuario.senha === this.senha
    );

    if (!usuarioEncontrado) {
      alert('Usuario ou Senha incorretos');
      return;
    }

    const rota = usuarioEncontrado.role === 'Admin' ? '/admin/romaneios' : '/usuario/romaneios';
    this.router.navigate([rota]);
  }

}
