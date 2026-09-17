import { Component, inject } from '@angular/core';
import { ItemEntrega } from '../../../models/item-entrega';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


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

  router = inject(Router);

  constructor() {
    const listaSalva = sessionStorage.getItem('romaneios');

    if (listaSalva) {
      this.lista = JSON.parse(listaSalva);
    } else {
      this.lista.push(new ItemEntrega(1, 'Joao Silva', 'Roupeiro, sofa, comoda', 'Rua Areias, 15-Foz do iguaçu/PR', 'Renault Master'));
      this.lista.push(new ItemEntrega(2, 'Maria santos', 'mesa, cadeiras', 'Rua Lagos , 222 -Foz do iguaçu/PR', 'Mercedes-Benz Sprinter'));
      this.lista.push(new ItemEntrega(3, 'Pedro junior', 'Painel de tv', 'Rua caçamba, 155-Foz do iguaçu/PR', 'Fiat Ducato'));
    }

    let entregaNova = history.state.entregaNova;
    let entregaEditada = history.state.entregaEditada;
    let nextId = this.lista.length > 0 ? Math.max(...this.lista.map(item => item.id)) + 1 : 1;

    if (entregaNova) {
      const onn = this.lista.some(item => item.cliente ===  entregaNova.cliente &&
        item.endereco === entregaNova.endereco
      );

      if(!onn) {
        entregaNova.id = nextId;
        this.lista.push(entregaNova);
      }
    }

    if (entregaEditada) {
      let index = this.lista.findIndex(item => item.id == entregaEditada.id);
      if (index >= 0) {
        this.lista[index] = entregaEditada;
      }
    }

    this.salvarNaSessao();
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
    this.router.navigate(['/romaneios/edit', entrega.id], { state: { entrega } });
  }

  deletar(entrega: ItemEntrega) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa entrega vai ser excluída.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {

    if (resultado.isConfirmed) {

      for (let i = 0; i < this.lista.length; i++) {
        if (this.lista[i].id == entrega.id) {
          this.lista.splice(i, 1);
          break;
        }
      }

      this.salvarNaSessao();

      Swal.fire({
        title: 'Excluído!',
        text: 'A entrega foi excluída!!!.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

    }
  });
}

  private salvarNaSessao() {
    sessionStorage.setItem('romaneios', JSON.stringify(this.lista));
  }

}
