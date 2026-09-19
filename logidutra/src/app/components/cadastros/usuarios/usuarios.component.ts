import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario.service';

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
  usuarioService = inject(UsuarioService);

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

}
