import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';


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

  logar() {
    if (this.usuario === 'admin' && this.senha === 'admin') {
      this.router.navigate(['/admin/romaneios']);
    } else if (this.usuario === 'usuario' && this.senha === 'usuario') {
      this.router.navigate(['/usuario/romaneios'])
    }
     else {
      alert("Usuario ou Senha incorretos");
    }
  }

}
