import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario-service.service';

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


  router = inject(Router);
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);

  logar(): void {
    if (!this.usuario || !this.senha) {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha usuário e senha.' });
      return;
    }

    this.usuarioService.login(this.usuario, this.senha).subscribe({
      next: (usuarioEncontrado) => {
        this.authService.entrar(usuarioEncontrado);
        const rota = usuarioEncontrado.role === 'ADMIN' ? '/admin/romaneios' : '/usuario/romaneios';
        this.router.navigate([rota]);
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Usuário ou senha incorretos.' });
      }
    });
  }

}
