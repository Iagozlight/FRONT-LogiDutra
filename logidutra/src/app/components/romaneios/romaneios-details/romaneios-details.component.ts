import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Romaneio, ProdutoRomaneio } from '../../../models/romaneio';
import { cliente } from '../../../models/cliente';
import { Veiculo } from '../../../models/veiculos';
import { usuario } from '../../../models/usuarios';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { CpfService } from '../../../services/cpf.service';
import { RomaneioService, RomaneiosRequestDTO } from '../../../services/romaneio.service';
import { UsuarioService } from '../../../services/usuario-service.service';
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
  romaneio = new Romaneio(0, new Date(), [], new Veiculo(0, '', '', '', false), new usuario(0, ''), []);
  dataFormulario = this.formatarDataInput(this.romaneio.data);
  horarioRomaneio = '';
  nomeProdutoCliente = '';
  quantidadeProdutoCliente = 1;
  carregando = false;
  salvando = false;
  erro = '';
  motoristas: usuario[] = [];
  veiculos: Veiculo[] = [];
  veiculo: Veiculo = new Veiculo(0, '', '', '', false);
  motoristaId: number | null = null;
  veiculoId: number | null = null;
  clientesPendentes: ClienteRomaneio[] = [];
  clienteEmCadastro: ClienteRascunho = this.novoCliente();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly clienteService = inject(ClienteService);
  private readonly cpfService = inject(CpfService);
  private readonly romaneioService = inject(RomaneioService);
  private readonly usuarioService = inject(UsuarioService);
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
          error: erro => {
            console.error('Erro ao buscar romaneio:', erro);
            this.carregando = false;
            this.erro = 'Não foi possível carregar o romaneio.';
          }
        });
      }
    }
  }

  buscarCep(): void {
    const cepLimpo = (this.clienteEmCadastro.cep || '').replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.clienteEmCadastro.logradouro = dados.logradouro ?? '';
            this.clienteEmCadastro.bairro = dados.bairro ?? '';
            this.clienteEmCadastro.cidade = dados.localidade ?? '';
          } else {
            Swal.fire({
              title: 'CEP não encontrado',
              text: 'O CEP informado não existe na base do ViaCEP.',
              icon: 'warning',
              confirmButtonText: 'Ok'
            });
          }
        },
        error: (err) => {
          console.error('Erro ao consultar ViaCEP:', err);
        }
      });
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
    const c = this.clienteEmCadastro;


    const camposPreenchidos = [
      c.nome, c.telefone, c.cpf, c.cep, c.logradouro, c.bairro, c.cidade
    ].every(campo => campo && campo.trim().length > 0);

    if (!camposPreenchidos) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Preencha todos os campos do cliente (Nome, Telefone, CPF, CEP, Endereço).',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return false;
    }


    if (!this.cpfService.validarCPF(c.cpf)) {
      Swal.fire({
        title: 'CPF inválido',
        text: 'O CPF informado é inválido. Digite um CPF válido com 11 dígitos.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return false;
    }


    if (!this.validarCEP(c.cep)) {
      Swal.fire({
        title: 'CEP inválido',
        text: 'O CEP deve conter 8 dígitos numéricos (ex: 85884000).',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return false;
    }


    if (!c.produtos.length) {
      Swal.fire({
        title: 'Sem produtos',
        text: 'Adicione pelo menos um produto para este cliente antes de incluí-lo.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return false;
    }

    const { produtos, ...dados } = this.clienteEmCadastro;


    dados.cep = dados.cep.replace(/\D/g, '');

    this.clientesPendentes.push({
      dados: { ...dados },
      produtos: [...produtos]
    });

    this.clienteEmCadastro = this.novoCliente();
    this.nomeProdutoCliente = '';
    this.quantidadeProdutoCliente = 1;
    return true;
  }

  editarCliente(indice: number): void {
    const clienteSelecionado = this.clientesPendentes[indice];
    if (!clienteSelecionado) {
      return;
    }

    this.clienteEmCadastro = {
      ...clienteSelecionado.dados,
      produtos: clienteSelecionado.produtos.map(prod => ({ ...prod }))
    };

    this.clientesPendentes.splice(indice, 1);
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

    const usuarioLogado = this.authService.usuarioAtual;
    if (!usuarioLogado || !usuarioLogado.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Sessão inválida',
        text: 'Usuário logado não identificado. Faça login novamente.'
      });
      return;
    }

    if (!this.dataFormulario) {
      Swal.fire({ title: 'Atenção', text: 'Informe a data do romaneio.', icon: 'warning' });
      return;
    }

    if (!this.veiculo || !this.veiculo.id) {
      Swal.fire({ title: 'Atenção', text: 'Selecione um veículo para o romaneio.', icon: 'warning' });
      return;
    }

    if (!this.motoristaId) {
      Swal.fire({ title: 'Atenção', text: 'Selecione um motorista para o romaneio.', icon: 'warning' });
      return;
    }

    if (!this.clientesPendentes.length) {
      Swal.fire({
        title: 'Atenção',
        text: 'Informe pelo menos um cliente completo na lista.',
        icon: 'warning'
      });
      return;
    }


    this.salvando = true;
    this.erro = '';

    this.salvarClientesPendentes(usuarioLogado.id).pipe(
      switchMap(clientesSalvos => {
        if (clientesSalvos.length) {
          let novoClienteIndice = 0;
          this.clientesPendentes = this.clientesPendentes.map(clienteAtual => {
            if (clienteAtual.dados.id && clienteAtual.dados.id > 0) {
              return clienteAtual;
            }
            const clienteSalvo = clientesSalvos[novoClienteIndice++];
            return { dados: clienteSalvo, produtos: clienteAtual.produtos };
          });
        }

        const clienteIds = this.clientesPendentes
          .map(c => Number(c.dados.id))
          .filter(id => id > 0);

        const payload: RomaneiosRequestDTO = {
          data: this.formatarDataParaBackend(this.dataFormulario),
          veiculoId: Number(this.veiculo.id),
          usuarioId: Number(this.motoristaId),
          clienteId: clienteIds,
          produtoId: []
        };

        return this.romaneio.id > 0
          ? this.romaneioService.update(this.romaneio.id, payload)
          : this.romaneioService.create(payload);
      })
    ).subscribe({
      next: romaneioSalvo => {
        this.romaneio = romaneioSalvo;
        this.salvarDetalhesExtras(romaneioSalvo.id);
        this.salvando = false;
        Swal.fire({ title: 'Romaneio finalizado!', icon: 'success', confirmButtonText: 'Ok' })
          .then(() => this.voltar());
      },
      error: erro => {
        console.error('Erro ao finalizar romaneio:', erro);
        this.salvando = false;

        let mensagemDetalhada = 'Verifique as informações e tente novamente.';
        if (typeof erro?.error === 'string') {
          mensagemDetalhada = erro.error;
        } else if (erro?.error?.message) {
          mensagemDetalhada = erro.error.message;
        }

        this.erro = mensagemDetalhada;
        Swal.fire({
          title: 'Não foi possível finalizar',
          text: mensagemDetalhada,
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
      next: usuarios => {
        this.motoristas = (Array.isArray(usuarios) ? usuarios : [])
          .filter(usuarioAtual => usuarioAtual.role === 'USER')
          .map(usuarioAtual => ({ ...usuarioAtual, id: Number(usuarioAtual.id) }));
      },
      error: erro => {
        console.error('Erro ao carregar motoristas:', erro);
        this.erro = 'Não foi possível carregar os motoristas.';
      }
    });

    this.veiculoHttpService.listAll().subscribe({
      next: veiculos => {
        this.veiculos = (Array.isArray(veiculos) ? veiculos : [])
          .map(veiculoAtual => ({ ...veiculoAtual, id: Number(veiculoAtual.id) }));
      },
      error: erro => {
        console.error('Erro ao carregar veículos:', erro);
        this.erro = 'Não foi possível carregar os veículos.';
      }
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
      motoristaNome: this.motoristas.find(m => m.id === this.motoristaId)?.nome,
      veiculoPlaca: this.veiculos.find(v => v.id === this.veiculoId)?.placa,
      horario: this.horarioRomaneio,
      clientes: this.clientesPendentes
    };
    localStorage.setItem(`romaneio-detalhes:${id}`, JSON.stringify(detalhes));
  }

  private salvarClientesPendentes(usuarioLogadoId: number): Observable<cliente[]> {
    const clientesNovos = this.clientesPendentes.filter(clienteAtual => !clienteAtual.dados.id || clienteAtual.dados.id === 0);
    if (!clientesNovos.length) {
      return of([]);
    }

    return forkJoin(
      clientesNovos.map(clienteAtual => {
        const { id, ...dadosParaCriacao } = clienteAtual.dados;

        dadosParaCriacao.cep = (dadosParaCriacao.cep || '').replace(/\D/g, '');
        return this.clienteService.create(dadosParaCriacao as cliente, usuarioLogadoId);
      })
    );
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

  private validarCEP(cep: string): boolean {
    if (!cep) return false;
    const apenasNumeros = cep.replace(/\D/g, '');
    return apenasNumeros.length === 8;
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
    this.romaneio = new Romaneio(romaneio.id, romaneio.data, romaneio.produtoList || [], this.veiculo, romaneio.motorista, romaneio.clientes || []);
    this.dataFormulario = this.formatarDataInput(this.romaneio.data);
  }

  private formatarDataInput(data: Date): string {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private formatarDataParaBackend(dataStr: string): string {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  }
}
