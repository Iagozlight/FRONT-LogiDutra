import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Romaneio } from '../../../models/romaneio';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';

interface ProdutoCliente {
  nome: string;
  quantidade: number;
}

interface ClienteRomaneio {
  dados: {
    nome: string;
    telefone: string;
    cpf: string;
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
  };
  produtos: ProdutoCliente[];
}

interface DetalhesExtras {
  motoristaNome?: string;
  veiculoPlaca?: string;
  horario?: string;
  clientes?: ClienteRomaneio[];

}


@Component({
  selector: 'app-romaneio-tela-principal',
  imports: [CommonModule],
  templateUrl: './romaneio-tela-principal.component.html',
  styleUrl: './romaneio-tela-principal.component.scss'
})
export class RomaneioTelaPrincipalComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly romaneioService = inject(RomaneioService);

  romaneio: Romaneio | null = null;
  carregando = true;
  erro = '';
  motoristaNome = 'Não informado';
  veiculoPlaca = 'Não informado';
  horario = 'Não informado';
  clientes: ClienteRomaneio[] = [];



  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const romaneioRecebido = history.state.romaneio as Romaneio | undefined;

    this.carregarRomaneio(id);

    if (!Number.isInteger(id) || id <= 0) {
      this.carregando = false;
      this.erro = 'Identificador de romaneio inválido.';
    } else if (romaneioRecebido) {
      this.romaneio = new Romaneio(
        romaneioRecebido.id,
        romaneioRecebido.data ? new Date(romaneioRecebido.data) : new Date(),
        romaneioRecebido.produtoList || romaneioRecebido.produtoList || [],
        romaneioRecebido.veiculo || null,
        romaneioRecebido.motorista || null,
        romaneioRecebido.clientes || []
      );
      this.carregarDetalhesExtras(id);
      this.carregando = false;
    } else {
      this.romaneioService.findById(id).subscribe({
        next: romaneioEncontrado => {
          this.romaneio = romaneioEncontrado;
          this.carregarDetalhesExtras(id);
          this.carregando = false;
        },
        error: () => {
          this.carregando = false;
          this.erro = 'Não foi possível carregar o romaneio.';
        }
      });
    }
  }

  private carregarDetalhesExtras(id: number): void {
    const salvo = localStorage.getItem(`romaneio-detalhes:${id}`);
    if (!salvo) {
      return;
    }

    try {
      const detalhes = JSON.parse(salvo) as DetalhesExtras;
      this.motoristaNome = detalhes.motoristaNome || 'Não informado';
      this.veiculoPlaca = detalhes.veiculoPlaca || 'Não informado';
      this.horario = detalhes.horario || 'Não informado';
      this.clientes = Array.isArray(detalhes.clientes) ? detalhes.clientes : [];
    } catch {
      this.motoristaNome = 'Não informado';
      this.veiculoPlaca = 'Não informado';
      this.horario = 'Não informado';
      this.clientes = [];
    }
  }

  carregarRomaneio(id:number){
    this.romaneioService.findById(id).subscribe({
      next: (resposta) => {
       this.romaneio = resposta;
       console.log(this.romaneio);
      }
    })
  }

  voltar(): void {
    this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios']);
  }
}
