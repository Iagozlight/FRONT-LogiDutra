import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-recuperar-senha',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  usuario!: string;

  enviarRecuperacao() {
    if (!this.usuario || this.usuario.trim() === '') {
      alert("Preencha o campo de Usuário!");
    } else {
      alert("Email enviado ao Administrador!");
    }
  }

}
