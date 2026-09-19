import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteEntrega, ItemEntrega, ProdutoEntrega, StatusRomaneio } from '../../../models/item-entrega';
import { veiculo } from '../../../models/veiculos';

@Component({
  selector: 'app-romaneio-tela-principal',
  imports: [CommonModule, FormsModule],
  templateUrl: './romaneio-tela-principal.component.html',
  styleUrl: './romaneio-tela-principal.component.scss'
})
export class RomaneioTelaPrincipalComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  entrega: ItemEntrega | null = null;
  veiculoSelecionado: veiculo | null = null;

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

    if ((this.entrega?.status as string) === 'Programado') {
      this.entrega.status = 'Preparado';
    }

    this.carregarVeiculo();
  }

  private carregarVeiculo() {
    if (!this.entrega) {
      return;
    }

    const veiculosSalvos = sessionStorage.getItem('veiculos');
    const veiculos: veiculo[] = veiculosSalvos ? JSON.parse(veiculosSalvos) : [];
    this.veiculoSelecionado = veiculos.find(veiculoAtual => veiculoAtual.placa === this.entrega?.veiculo) ?? null;
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

  alterarStatus(status: StatusRomaneio) {
    if (!this.entrega) {
      return;
    }

    this.entrega.status = status;
    const romaneiosSalvos = sessionStorage.getItem('romaneios');
    const romaneios: ItemEntrega[] = romaneiosSalvos ? JSON.parse(romaneiosSalvos) : [];
    const indice = romaneios.findIndex(romaneio => romaneio.id === this.entrega?.id);

    if (indice >= 0) {
      romaneios[indice] = this.entrega;
      sessionStorage.setItem('romaneios', JSON.stringify(romaneios));
    }
  }
}
