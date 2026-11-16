import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { cliente } from '../../../models/cliente';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { CpfService } from '../../../services/cpf.service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  clientes: cliente[] = [];
  paginaAtual = 1;
  MaxPag = 6;
  clienteService = inject(ClienteService);
  authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly cpfService = inject(CpfService);

  clienteEmCadastro = new cliente(0, '', '', '', '', '', '', '');
  modalAberto = false;
  carregando = false;
  salvando = false;

  constructor() {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando = true;
    this.clienteService.listAll().subscribe({
      next: clientes => {
        this.clientes = clientes;
        this.carregando = false;
      },
      error: erro => {
        console.error('Erro ao carregar clientes:', erro);
        this.carregando = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível carregar os clientes.'
        });
      }
    });
  }

  get clientesPaginados(): cliente[] {
    const inicio = (this.paginaAtual - 1) * this.MaxPag;
    return this.clientes.slice(inicio, inicio + this.MaxPag);
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientes.length / this.MaxPag) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, indice) => indice + 1);
  }

  irParaPagina(pagina: number): void {
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

  abrirModal(): void {
    this.clienteEmCadastro = new cliente(0, '', '', '', '', '', '', '');
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  buscarCep(): void {
    const cepLimpo = (this.clienteEmCadastro.cep || '').replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return;
    }

    this.http.get<{ erro?: boolean; logradouro?: string; bairro?: string; localidade?: string }>(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    ).subscribe({
      next: dados => {
        if (dados.erro) {
          Swal.fire({
            title: 'CEP não encontrado',
            text: 'O CEP informado não existe na base do ViaCEP.',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
          return;
        }

        this.clienteEmCadastro.logradouro = dados.logradouro ?? '';
        this.clienteEmCadastro.bairro = dados.bairro ?? '';
        this.clienteEmCadastro.cidade = dados.localidade ?? '';
      },
      error: erro => {
        console.error('Erro ao consultar ViaCEP:', erro);
        Swal.fire({
          title: 'Erro ao consultar CEP',
          text: 'Não foi possível buscar o endereço. Preencha os campos manualmente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  cadastrar(): void {
    const dados = this.clienteEmCadastro;
    const camposPreenchidos = [
      dados.nome, dados.telefone, dados.cpf, dados.cep,
      dados.logradouro, dados.bairro, dados.cidade
    ].every(campo => campo && campo.trim().length > 0);

    if (!camposPreenchidos) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos do cliente.'
      });
      return;
    }

    if (!this.cpfService.validarCPF(dados.cpf)) {
      Swal.fire({
        icon: 'error',
        title: 'CPF inválido',
        text: 'Informe um CPF válido com 11 dígitos.'
      });
      return;
    }

    const cepLimpo = dados.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      Swal.fire({
        icon: 'error',
        title: 'CEP inválido',
        text: 'O CEP deve conter 8 dígitos numéricos.'
      });
      return;
    }

    const usuarioLogado = this.authService.usuarioAtual;
    if (!usuarioLogado?.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Sessão inválida',
        text: 'Usuário logado não identificado. Faça login novamente.'
      });
      return;
    }

    const clienteParaSalvar = new cliente(
      0,
      dados.nome.trim(),
      dados.cpf.trim(),
      dados.telefone.trim(),
      cepLimpo,
      dados.logradouro.trim(),
      dados.bairro.trim(),
      dados.cidade.trim()
    );

    this.salvando = true;
    this.clienteService.create(clienteParaSalvar, usuarioLogado.id).subscribe({
      next: clienteSalvo => {
        this.clientes = [...this.clientes, clienteSalvo];
        this.paginaAtual = this.totalPaginas;
        this.salvando = false;
        this.fecharModal();
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Cliente cadastrado com sucesso.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: erro => {
        console.error('Erro ao cadastrar cliente:', erro);
        this.salvando = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: erro?.error?.message || 'Não foi possível cadastrar o cliente.'
        });
      }
    });
  }
}
