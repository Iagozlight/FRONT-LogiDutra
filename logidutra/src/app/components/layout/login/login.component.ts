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
  standalone: true,
  imports: [MdbCollapseModule, MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario = '';
  senha = '';
  lembrarUsuario = false;

  router = inject(Router);
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);

  logar(): void {
    const usuarioLimpo = this.usuario?.trim();
    const senhaLimpa = this.senha?.trim();

    if (!usuarioLimpo || !senhaLimpa) {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha usuário e senha.' });
      return;
    }

    this.usuarioService.login(usuarioLimpo, senhaLimpa).subscribe({
      next: (usuarioEncontrado) => {
        this.authService.entrar(usuarioEncontrado);

        const ehAdmin = usuarioEncontrado.role?.toUpperCase() === 'ADMIN';
        const rota = ehAdmin ? '/admin/romaneios' : '/usuario/romaneios';

        this.router.navigate([rota]);
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Usuário ou senha incorretos.' });
      }
    });
  }
}
