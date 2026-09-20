import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteEntrega, ItemEntrega, ProdutoEntrega, StatusRomaneio } from '../../../models/item-entrega';
import { veiculo } from '../../../models/veiculos';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';
import { VeiculoService } from '../../../services/veiculo.service';

@Component({
  selector: 'app-romaneio-tela-principal',
  imports: [CommonModule, FormsModule],
  templateUrl: './romaneio-tela-principal.component.html',
  styleUrl: './romaneio-tela-principal.component.scss'
})
export class RomaneioTelaPrincipalComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly authService: AuthService = inject(AuthService);
  private romaneioService = inject(RomaneioService);
  private veiculoService = inject(VeiculoService);

  entrega: ItemEntrega | null = null;
  veiculoSelecionado: veiculo | null = null;

  constructor() {
    const entregaRecebida = history.state.entrega as ItemEntrega | undefined;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (entregaRecebida) {
      this.entrega = this.romaneioService.normalizar(entregaRecebida);
    } else {
      this.entrega = this.romaneioService.buscarPorId(id) ?? null;
    }

    if (this.entrega && (this.entrega.status as string) === 'Programado') {
      this.entrega.status = 'Preparado';
    }

    this.carregarVeiculo();
  }

  private carregarVeiculo() {
    if (!this.entrega) {
      return;
    }

    this.veiculoSelecionado = this.veiculoService.buscarPorPlaca(this.entrega.veiculo) ?? null;
  }

  get clientes(): ClienteEntrega[] {
    return this.entrega?.clientes ?? [];
  }

  voltar() {
    this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios']);
  }

  alterarStatus(status: StatusRomaneio) {
    if (!this.authService.ehAdmin || !this.entrega) {
      return;
    }

    this.entrega.status = status;
    this.romaneioService.atualizarStatus(this.entrega.id, status);
  }
}
