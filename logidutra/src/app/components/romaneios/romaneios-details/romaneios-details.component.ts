import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Romaneio, ProdutoRomaneio } from '../../../models/romaneio';
import { cliente } from '../../../models/cliente';
import { veiculo } from '../../../models/veiculos';
import { usuario } from '../../../models/usuarios';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { RomaneioService } from '../../../services/romaneio.service';
import { UsuarioServiceService } from '../../../services/usuario-service.service';
import { VeiculoHttpService } from '../../../services/veiculo-http.service';

interface ClienteRomaneio {
  dados: cliente;
  produtos: ProdutoRomaneio[];
}

interface DetalhesExtras {
  motoristaId: number | null;
  veiculoId: number | null;
  motoristaNome?: string;
  veiculoPlaca?: string;
  horario: string;
  clientes: ClienteRomaneio[];
}

interface ClienteRascunho extends cliente {
  produtos: ProdutoRomaneio[];
}

@Component({
  selector: 'app-romaneios-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './romaneios-details.component.html',
  styleUrl: './romaneios-details.component.scss'
})
export class RomaneiosDetailsComponent {
  titulo = 'Cadastrar romaneio';
  romaneio = new Romaneio(0, new Date(), []);
  dataFormulario = this.formatarDataInput(this.romaneio.data);
  horarioRomaneio = '';
  nomeProdutoCliente = '';
  quantidadeProdutoCliente = 1;
  carregando = false;
  salvando = false;
  erro = '';
  motoristas: usuario[] = [];
  veiculos: veiculo[] = [];
  motoristaId: number | null = null;
  veiculoId: number | null = null;
  clientesPendentes: ClienteRomaneio[] = [];
  clienteEmCadastro: ClienteRascunho = this.novoCliente();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly clienteService = inject(ClienteService);
  private readonly romaneioService = inject(RomaneioService);
  private readonly usuarioService = inject(UsuarioServiceService);
  private readonly veiculoHttpService = inject(VeiculoHttpService);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const romaneioRecebido = history.state.romaneio as Romaneio | undefined;
    this.carregarOpcoes();

    if (id > 0) {
      this.titulo = 'Editar romaneio';
      if (romaneioRecebido) {
        this.definirRomaneio(romaneioRecebido);
        this.carregarDetalhesExtras(id);
      } else {
        this.carregando = true;
        this.romaneioService.findById(id).subscribe({
          next: romaneioEncontrado => {
            this.definirRomaneio(romaneioEncontrado);
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
  }

  adicionarProdutoCliente(): void {
    const nome = this.nomeProdutoCliente.trim();
    const quantidade = Math.floor(Number(this.quantidadeProdutoCliente));
    if (!nome || quantidade < 1) {
      return;
    }

    this.clienteEmCadastro.produtos.push({ nome, quantidade });
    this.nomeProdutoCliente = '';
    this.quantidadeProdutoCliente = 1;
  }

  removerProdutoCliente(indice: number): void {
    this.clienteEmCadastro.produtos.splice(indice, 1);
  }

  adicionarCliente(): boolean {
    if (!this.validarCliente(this.clienteEmCadastro) || !this.clienteEmCadastro.produtos.length) {
      Swal.fire({
        title: 'Cliente incompleto',
        text: 'Preencha todos os dados e adicione pelo menos um produto para o cliente.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return false;
    }

    const { produtos, ...dados } = this.clienteEmCadastro;
    this.clientesPendentes.push({ dados: { ...dados, id: 0 }, produtos: [...produtos] });
    this.clienteEmCadastro = this.novoCliente();
    this.nomeProdutoCliente = '';
    this.quantidadeProdutoCliente = 1;
    return true;
  }

  removerCliente(indice: number): void {
    this.clientesPendentes.splice(indice, 1);
  }

  salvar(): void {
    if (this.salvando || this.carregando) {
      return;
    }

    if (this.clienteTemDados()) {
      if (!this.adicionarCliente()) {
        return;
      }
    }

    const data = new Date(`${this.dataFormulario}T00:00:00`);
    if (Number.isNaN(data.getTime()) || !this.horarioRomaneio || !this.clientesPendentes.length) {
      Swal.fire({
        title: 'Atenção',
        text: 'Informe data, horário e pelo menos um cliente completo.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.romaneio.data = data;
    this.romaneio.produtoList = this.clientesPendentes.flatMap(clienteAtual => clienteAtual.produtos);
    this.salvando = true;
    this.erro = '';

    this.salvarClientesPendentes().pipe(
      switchMap(clientesSalvos => {
        if (clientesSalvos.length) {
          let novoClienteIndice = 0;
          this.clientesPendentes = this.clientesPendentes.map(clienteAtual => {
            if (clienteAtual.dados.id) {
              return clienteAtual;
            }
            const clienteSalvo = clientesSalvos[novoClienteIndice++];
            return { dados: clienteSalvo, produtos: clienteAtual.produtos };
          });
        }
        return this.romaneio.id > 0
          ? this.romaneioService.update(this.romaneio.id, this.romaneio)
          : this.romaneioService.create(this.romaneio);
      })
    ).subscribe({
      next: romaneioSalvo => {
        this.romaneio = romaneioSalvo;
        this.salvarDetalhesExtras(romaneioSalvo.id);
        this.salvando = false;
        Swal.fire({ title: 'Romaneio finalizado', icon: 'success', confirmButtonText: 'Ok' })
          .then(() => this.voltar());
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível finalizar o romaneio.';
        Swal.fire({
          title: 'Não foi possível finalizar',
          text: 'Verifique os dados e tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  voltar(): void {
    this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios']);
  }

  private carregarOpcoes(): void {
    this.usuarioService.listAll().subscribe({
      next: usuarios => this.motoristas = usuarios.filter(usuarioAtual => usuarioAtual.role === 'USER'),
      error: () => this.erro = 'Não foi possível carregar os motoristas.'
    });
    this.veiculoHttpService.listAll().subscribe({
      next: veiculos => this.veiculos = veiculos,
      error: () => this.erro = 'Não foi possível carregar os veículos.'
    });
  }

  private carregarDetalhesExtras(id: number): void {
    const salvo = localStorage.getItem(`romaneio-detalhes:${id}`);
    if (!salvo) {
      return;
    }

    try {
      const detalhes = JSON.parse(salvo) as DetalhesExtras;
      this.motoristaId = detalhes.motoristaId ?? null;
      this.veiculoId = detalhes.veiculoId ?? null;
      this.horarioRomaneio = detalhes.horario || '';
      this.clientesPendentes = Array.isArray(detalhes.clientes)
        ? detalhes.clientes.map(clienteAtual => this.normalizarClienteRomaneio(clienteAtual))
        : [];
    } catch {
      this.motoristaId = null;
      this.veiculoId = null;
      this.horarioRomaneio = '';
      this.clientesPendentes = [];
    }
  }

  private salvarDetalhesExtras(id: number): void {
    const detalhes: DetalhesExtras = {
      motoristaId: this.motoristaId,
      veiculoId: this.veiculoId,
      motoristaNome: this.motoristas.find(motorista => motorista.id === this.motoristaId)?.nome,
      veiculoPlaca: this.veiculos.find(veiculo => veiculo.id === this.veiculoId)?.placa,
      horario: this.horarioRomaneio,
      clientes: this.clientesPendentes
    };
    localStorage.setItem(`romaneio-detalhes:${id}`, JSON.stringify(detalhes));
  }

  private salvarClientesPendentes(): Observable<cliente[]> {
    const clientesNovos = this.clientesPendentes.filter(clienteAtual => !clienteAtual.dados.id);
    if (!clientesNovos.length) {
      return of([]);
    }
    return forkJoin(clientesNovos.map(clienteAtual => this.clienteService.create(clienteAtual.dados)));
  }

  private normalizarClienteRomaneio(clienteAtual: ClienteRomaneio | cliente): ClienteRomaneio {
    if ('dados' in clienteAtual) {
      return {
        dados: clienteAtual.dados,
        produtos: Array.isArray(clienteAtual.produtos) ? clienteAtual.produtos : []
      };
    }
    return { dados: clienteAtual, produtos: [] };
  }

  private validarCliente(clienteAtual: ClienteRascunho): boolean {
    return [
      clienteAtual.nome,
      clienteAtual.telefone,
      clienteAtual.cpf,
      clienteAtual.cep,
      clienteAtual.logradouro,
      clienteAtual.bairro,
      clienteAtual.cidade
    ].every(campo => campo.trim().length > 0);
  }

  private clienteTemDados(): boolean {
    return Object.values(this.clienteEmCadastro).some(valor => typeof valor === 'string' && valor.trim().length > 0)
      || this.clienteEmCadastro.produtos.length > 0;
  }

  private novoCliente(): ClienteRascunho {
    return {
      id: 0,
      nome: '',
      cpf: '',
      telefone: '',
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      produtos: []
    };
  }

  private definirRomaneio(romaneio: Romaneio): void {
    this.romaneio = new Romaneio(romaneio.id, romaneio.data, romaneio.produtoList || []);
    this.dataFormulario = this.formatarDataInput(this.romaneio.data);
  }

  private formatarDataInput(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
