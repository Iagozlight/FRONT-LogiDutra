import { Component } from '@angular/core';
import { ItemEntrega } from '../../../models/item-entrega';

@Component({
  selector: 'app-romaneios-list',
  imports: [],
  templateUrl: './romaneios-list.component.html',
  styleUrl: './romaneios-list.component.scss'
})
export class RomaneiosListComponent {
  itens: ItemEntrega[] = [
    new ItemEntrega('João Silva', 'Roupeiro, sofa, comoda', 'Rua das Flores, 123 - Foz do Iguaçu/PR'),
    new ItemEntrega('Maria Souza', 'Mesa, cadeira, armário', 'Av. Brasil, 456 - Foz do Iguaçu/PR'),
    new ItemEntrega('Pedro Lima', 'Painel de tv', 'Rua XV de Novembro, 789 - Foz do Iguaçu/PR'),
  ];
}
