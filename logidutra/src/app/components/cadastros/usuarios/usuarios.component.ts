import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { usuario } from '../../../models/usuarios';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  router = inject(Router);
  usuarios: usuario[] = [];
  paginaAtual = 1;
  MaxPag = 6;

  constructor() {
    const usuariosSalvos = sessionStorage.getItem('usuarios');
    const usuariosSalvosLista: usuario[] = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
    const usuarioPadrao = usuario.padrao();

    this.usuarios = [...usuariosSalvosLista, usuarioPadrao].filter(
      (usuarioAtual, indice, lista) => lista.findIndex(item => item.nome === usuarioAtual.nome) === indice
    );
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

}
