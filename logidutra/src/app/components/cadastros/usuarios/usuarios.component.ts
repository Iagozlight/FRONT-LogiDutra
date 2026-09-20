import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  usuarios: usuario[] = [];
  paginaAtual = 1;
  MaxPag = 6;
  usuarioService = inject(UsuarioService);
  usuarioEmCadastro = new usuario(0, '', '', 0, '');
  modalAberto = false;

  constructor() {
    this.usuarios = this.usuarioService.listarComPadrao();
  }


  get usuariosPaginados(): usuario[] {
    const inicio = (this.paginaAtual - 1) * this.MaxPag;
    return this.usuarios.slice(inicio, inicio + this.MaxPag);
  }
  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.MaxPag) || 1;
  }


  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, indice) => indice + 1);
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }

  }


  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual - 1);

  }

  paginaProxima(): void {
    this.irParaPagina(this.paginaAtual + 1);
  }

  abrirModal(): void {
    this.usuarioEmCadastro = new usuario(0, '', '', 0, '');
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  cadastrar(): void {
    if (!this.usuarioEmCadastro.nome.trim() || !this.usuarioEmCadastro.senha || !this.usuarioEmCadastro.role) {
      alert('Preencha nome, senha e role!');
      return;
    }

    if ([usuario.padrao(), ...this.usuarioService.listar()]
      .some(usuarioAtual => usuarioAtual.nome === this.usuarioEmCadastro.nome.trim())) {
      alert('Esse usuário já existe!');
      return;
    }

    const usuarios = [usuario.padrao(), ...this.usuarioService.listar()];
    this.usuarioEmCadastro.nome = this.usuarioEmCadastro.nome.trim();
    this.usuarioEmCadastro.id = Math.max(...usuarios.map(usuarioAtual => usuarioAtual.id), 0) + 1;
    this.usuarioEmCadastro.Disp = false;
    this.usuarioService.adicionar(this.usuarioEmCadastro);
    this.usuarios = this.usuarioService.listarComPadrao();
    this.modalAberto = false;
  }

}
