import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { usuario } from '../../../models/usuarios';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';


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
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);

  logar() {
    const todosUsuarios = this.usuarioService.listarComPadrao();
    const usuarioEncontrado = todosUsuarios.find(
      usuario => usuario.nome === this.usuario && usuario.senha === this.senha
    );

    if (!usuarioEncontrado) {
      alert('Usuario ou Senha incorretos');
      return;
    }

    this.authService.entrar(usuarioEncontrado);
    const rota = usuarioEncontrado.role === 'Admin' ? '/admin/romaneios' : '/usuario/romaneios';
    this.router.navigate([rota]);
  }

}
