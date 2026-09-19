import { Component, inject } from '@angular/core';
import { ItemEntrega, StatusRomaneio } from '../../../models/item-entrega';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';


@Component({
  selector: 'app-romaneios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './romaneios-list.component.html',
  styleUrl: './romaneios-list.component.scss'
})
export class RomaneiosListComponent {
  lista: ItemEntrega[] = [];

  paginaAtual = 1;
  MaxPag = 6;
  statusMenuAberto: number | null = null;

  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  romaneioService = inject(RomaneioService);

  constructor() {
    this.lista = this.romaneioService.listar();

    let entregaNova = history.state.entregaNova;
    let entregaEditada = history.state.entregaEditada;
    let nextId = this.lista.length > 0 ? Math.max(...this.lista.map(item => item.id)) + 1 : 1;

    if (entregaNova) {
      const onn = this.lista.some(item => item.cliente ===  entregaNova.cliente &&
        item.endereco === entregaNova.endereco
      );

      if(!onn) {
        entregaNova.status = entregaNova.status || 'Preparado';
        this.romaneioService.adicionar(entregaNova);
      }
    }

    if (entregaEditada) {
      let index = this.lista.findIndex(item => item.id == entregaEditada.id);
      if (index >= 0) {
        this.romaneioService.atualizar(entregaEditada);
      }
    }

    this.lista = this.romaneioService.listar();
  }


  get listaPaginada(): ItemEntrega[] {
    const inicio = (this.paginaAtual -1) * this.MaxPag;
    return this.lista.slice(inicio, inicio + this.MaxPag);
  }

  get totalPaginas(): number {
    return Math.ceil(this.lista.length / this.MaxPag) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
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

  editar(entrega: ItemEntrega) {
    if (!this.authService.ehAdmin) {
      return;
    }
    this.router.navigate(['/admin/romaneios/edit', entrega.id], { state: { entrega } });
  }

  abrirRomaneio(entrega: ItemEntrega) {
    this.router.navigate([entrega.id], {
      relativeTo: this.route,
      state: { entrega }
    });
  }

  alterarStatus(entrega: ItemEntrega, status: StatusRomaneio) {
    entrega.status = status;
    this.statusMenuAberto = null;
    this.romaneioService.atualizarStatus(entrega.id, status);
  }

  alternarMenuStatus(entrega: ItemEntrega) {
    this.statusMenuAberto = this.statusMenuAberto === entrega.id ? null : entrega.id;
  }

  ehSeuRomaneio(entrega: ItemEntrega): boolean {
    const usuarioAtual = this.authService.usuarioAtual;
    return usuarioAtual?.role === 'Motorista' &&
      this.normalizarNome(usuarioAtual.nome) === this.normalizarNome(entrega.motorista);
  }

  private normalizarNome(nome: string): string {
    return nome.trim().toLocaleLowerCase();
  }

  deletar(entrega: ItemEntrega) {
    if (!this.authService.ehAdmin) {
      return;
    }
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa entrega vai ser excluída.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {

    if (resultado.isConfirmed) {

      this.romaneioService.excluir(entrega.id);
      this.lista = this.romaneioService.listar();

      Swal.fire({
        title: 'Excluído!',
        text: 'A entrega foi excluída!!!.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

    }
  });
}

}
