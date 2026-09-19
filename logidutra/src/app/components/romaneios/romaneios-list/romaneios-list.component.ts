import { Component, inject } from '@angular/core';
import { ClienteEntrega, ItemEntrega, StatusRomaneio } from '../../../models/item-entrega';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  route = inject(ActivatedRoute);

  constructor() {
    const listaSalva = sessionStorage.getItem('romaneios');

    if (listaSalva) {
      this.lista = JSON.parse(listaSalva);
      this.lista.forEach(entrega => {
        entrega.clientes = entrega.clientes || [];
        entrega.status = entrega.status === 'Programado' ? 'Preparado' : (entrega.status || 'Preparado');
      });
    } else {
      this.lista = [
        this.criarRomaneio(1, 'Joao Silva', 'Rua Areias, 15 - Foz do Iguacu/PR', [
          ['Roupeiro', 1], ['Sofa', 1], ['Comoda', 2]
        ], 'Renault Master', 'Carlos Mendes', 'Em andamento'),
        this.criarRomaneio(2, 'Maria Santos', 'Rua Lagos, 222 - Foz do Iguacu/PR', [
          ['Mesa', 1], ['Cadeiras', 6]
        ], 'Mercedes-Benz Sprinter', 'Rafael Souza', 'Preparado'),
        this.criarRomaneio(3, 'Pedro Junior', 'Rua Cacamba, 155 - Foz do Iguacu/PR', [
          ['Painel de TV', 1]
        ], 'Fiat Ducato', 'Marcos Oliveira', 'Encerrado')
      ];
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
        entregaNova.status = entregaNova.status || 'Preparado';
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

  private criarRomaneio(
    id: number,
    nomeCliente: string,
    endereco: string,
    produtos: [string, number][],
    veiculo: string,
    motorista: string
    ,status: StatusRomaneio
  ): ItemEntrega {
    const entrega = new ItemEntrega(id, nomeCliente, '', endereco, veiculo, motorista, status);
    const produtosFormatados = produtos.map(([nome, quantidade]) => ({ nome, quantidade }));
    const cliente: ClienteEntrega = {
      nome: nomeCliente,
      endereco,
      produtos: produtosFormatados,
      finalizado: true
    };
    entrega.clientes = [cliente];
    entrega.produtos = produtosFormatados;
    entrega.itemComprado = produtosFormatados.map(produto => `${produto.nome} (${produto.quantidade}x)`).join(', ');
    return entrega;
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
    this.router.navigate(['/admin/romaneios/edit', entrega.id], { state: { entrega } });
  }

  abrirRomaneio(entrega: ItemEntrega) {
    this.router.navigate([entrega.id], {
      relativeTo: this.route,
      state: { entrega }
    });
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
