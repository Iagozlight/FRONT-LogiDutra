import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Romaneio } from '../../../models/romaneio';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';

export type StatusCliente = 'espera' | 'caminho' | 'finalizado';

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
  finalizado: boolean;
  status: StatusCliente;
}

interface DetalhesExtras {
  motoristaNome?: string;
  veiculoPlaca?: string;
  horario?: string;
  clientes?: any[];

}


@Component({
  selector: 'app-romaneio-tela-principal',
  standalone: true,
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




    if (!Number.isInteger(id) || id <= 0) {
      this.carregando = false;
      this.erro = 'Identificador de romaneio inválido.';
      return;
    }

    if (romaneioRecebido) {
      this.romaneio = new Romaneio(
        romaneioRecebido.id,
        romaneioRecebido.data ? new Date(romaneioRecebido.data) : new Date(),
        romaneioRecebido.produtoList || [],
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

  get romaneioFinalizado(): boolean {
    return this.clientes.length > 0 && this.clientes.every(c => c.finalizado || c.status === 'finalizado');
  }

  private carregarDetalhesExtras(id: number): void {
    const salvo = localStorage.getItem(`romaneio-detalhes:${id}`);




    if (salvo) {
      try {
        const detalhes = JSON.parse(salvo) as DetalhesExtras;
        this.motoristaNome = detalhes.motoristaNome || 'Não informado';
        this.veiculoPlaca = detalhes.veiculoPlaca || 'Não informado';
        this.horario = detalhes.horario || 'Não informado';

        if (Array.isArray(detalhes.clientes) && detalhes.clientes.length > 0) {
          this.clientes = this.normalizarClientes(detalhes.clientes);
        }
      } catch {}
    }

    if (this.clientes.length === 0 && this.romaneio?.clientes && this.romaneio.clientes.length > 0) {
      this.clientes = this.normalizarClientes(this.romaneio.clientes);
    }
  }

  private normalizarClientes(clientesBrutos: any[]): ClienteRomaneio[] {
    if (!Array.isArray(clientesBrutos)) return [];

    return clientesBrutos.map(c => {
      const dados = c.dados ? {
        nome: c.dados.nome || 'Não informado',
        telefone: c.dados.telefone || 'Não informado',
        cpf: c.dados.cpf || 'Não informado',
        cep: c.dados.cep || 'Não informado',
        logradouro: c.dados.logradouro || 'Não informado',
        bairro: c.dados.bairro || 'Não informado',
        cidade: c.dados.cidade || 'Não informado'
      } : {
        nome: c.nome || 'Não informado',
        telefone: c.telefone || 'Não informado',
        cpf: c.cpf || 'Não informado',
        cep: c.cep || 'Não informado',
        logradouro: c.logradouro || 'Não informado',
        bairro: c.bairro || 'Não informado',
        cidade: c.cidade || 'Não informado'
      };

      let produtos: ProdutoCliente[] = [];

      if (Array.isArray(c.produtos) && c.produtos.length > 0) {
        produtos = c.produtos.map((p: any) => ({
          nome: p.nome || p.produto?.nome || 'Produto sem nome',
          quantidade: Number(p.quantidade || p.qtd) || 1
        }));
      } else if (this.romaneio?.produtoList && this.romaneio.produtoList.length > 0) {
        produtos = this.romaneio.produtoList.map(p => ({
          nome: p.nome || 'Produto sem nome',
          quantidade: 1
        }));
      }

      const statusInicial: StatusCliente = c.status || (c.finalizado ? 'finalizado' : 'espera');

      return {
        dados,
        produtos,
        finalizado: statusInicial === 'finalizado',
        status: statusInicial
      };
    });
  }

  alterarStatusCliente(index: number, novoStatus: StatusCliente): void {
    const cliente = this.clientes[index];
    if (!cliente) return;

    if (novoStatus === 'caminho') {
      // Regra: Apenas 1 cliente pode estar "A caminho". Qualquer outro que estivesse a caminho volta para "espera"
      this.clientes.forEach((c, i) => {
        if (i !== index && c.status === 'caminho') {
          c.status = 'espera';
          c.finalizado = false;
        }
      });
      cliente.status = 'caminho';
      cliente.finalizado = false;
    } else if (novoStatus === 'finalizado') {
      cliente.status = 'finalizado';
      cliente.finalizado = true;
    } else {
      // Na Espera
      cliente.status = 'espera';
      cliente.finalizado = false;
    }

    this.salvarEstadoLocal();
  }

  finalizarCliente(index: number): void {
    this.alterarStatusCliente(index, 'finalizado');
  }

  reativarCliente(index: number): void {
    this.alterarStatusCliente(index, 'espera');
  }

  finalizarRomaneio(): void {
    this.clientes.forEach(cliente => {
      cliente.status = 'finalizado';
      cliente.finalizado = true;
    });
    this.salvarEstadoLocal();
  }

  reativarRomaneio(): void {
    this.clientes.forEach(cliente => {
      cliente.status = 'espera';
      cliente.finalizado = false;
    });
    this.salvarEstadoLocal();
  }

  private salvarEstadoLocal(): void {
    if (!this.romaneio) return;

    const id = this.romaneio.id;
    const chave = `romaneio-detalhes:${id}`;

    const dadosSalvar: DetalhesExtras = {
      motoristaNome: this.motoristaNome,
      veiculoPlaca: this.veiculoPlaca,
      horario: this.horario,
      clientes: this.clientes
    };

    localStorage.setItem(chave, JSON.stringify(dadosSalvar));
  }

  voltar(): void {
    this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios']);
  }
}

