import { Component, inject } from '@angular/core';
import { ItemEntrega } from '../../../models/item-entrega';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-romaneios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './romaneios-list.component.html',
  styleUrl: './romaneios-list.component.scss'
})
export class RomaneiosListComponent {
  lista: ItemEntrega[] = [];

  router = inject(Router);

  constructor() {
    this.lista.push(new ItemEntrega(1, 'Joao Silva', 'Roupeiro, sofa, comoda', 'Rua Areias, 15-Foz do iguaçu/PR'));
    this.lista.push(new ItemEntrega(2, 'Maria santos', 'mesa, cadeiras', 'Rua Lagos , 222 -Foz do iguaçu/PR'));
    this.lista.push(new ItemEntrega(3, 'Pedro junior', 'Painel de tv', 'Rua caçamba, 155-Foz do iguaçu/PR'));

    let entregaNova = history.state.entregaNova;
    let entregaEditada = history.state.entregaEditada;
    let nextId = 4;

    if (entregaNova) {
      entregaNova.id = nextId + 1;
      this.lista.push(entregaNova);
    }

    if (entregaEditada) {
      let index = this.lista.findIndex(item => item.id == entregaEditada.id);
      if (index >= 0) {
        this.lista[index] = entregaEditada;
      }
    }
  }

  editar(entrega: ItemEntrega) {
    this.router.navigate(['/romaneios/edit', entrega.id], { state: { entrega } });
  }

  deletar(entrega: ItemEntrega) {
    for (let i = 0; i < this.lista.length; i++) {
      if (this.lista[i].id == entrega.id) {
        this.lista.splice(i, 1);
        break;
      }
    }
  }

}