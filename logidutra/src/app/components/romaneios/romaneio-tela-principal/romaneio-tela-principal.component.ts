import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteEntrega, ItemEntrega, ProdutoEntrega } from '../../../models/item-entrega';

@Component({
  selector: 'app-romaneio-tela-principal',
  imports: [CommonModule],
  templateUrl: './romaneio-tela-principal.component.html',
  styleUrl: './romaneio-tela-principal.component.scss'
})
export class RomaneioTelaPrincipalComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  entrega: ItemEntrega | null = null;

  constructor() {
    const entregaRecebida = history.state.entrega as ItemEntrega | undefined;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (entregaRecebida) {
      this.entrega = entregaRecebida;
    } else {
      const romaneiosSalvos = sessionStorage.getItem('romaneios');
      const romaneios: ItemEntrega[] = romaneiosSalvos ? JSON.parse(romaneiosSalvos) : [];
      this.entrega = romaneios.find(romaneio => romaneio.id === id) ?? null;
    }
  }

  get clientes(): ClienteEntrega[] {
    return (this.entrega?.clientes ?? []).map(cliente => ({
      ...cliente,
      produtos: (cliente.produtos as unknown as Array<ProdutoEntrega | string>).map(produto =>
        typeof produto === 'string' ? { nome: produto, quantidade: 1 } : { ...produto, quantidade: produto.quantidade || 1 }
      )
    }));
  }

  voltar() {
    this.router.navigate(['/admin/romaneios']);
  }
}
