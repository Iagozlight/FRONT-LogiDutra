import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Veiculo } from '../../../models/veiculos';
import { VeiculoHttpService } from '../../../services/veiculo-http.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-veiculos',
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export class VeiculosComponent {
  veiculos: Veiculo[] = [];
  paginaAtual = 1;
  MaxPag = 6;

  veiculoService = inject(VeiculoHttpService);
  authService = inject(AuthService);

  veiculoEmCadastro = new Veiculo(0, '', '', '');
  modalAberto = false;
  modoEdicao = false;

  constructor() {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.listAll().subscribe({
      next: (veiculos) => {
        this.veiculos = veiculos;
      },
      error: (erro) => {
        console.error('Erro ao carregar veículos:', erro);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível carregar os veículos.'
        });
      }
    });
  }

  get veiculosPaginados(): Veiculo[] {
    const inicio = (this.paginaAtual - 1) * this.MaxPag;
    return this.veiculos.slice(inicio, inicio + this.MaxPag);
  }

  get totalPaginas(): number {
    return Math.ceil(this.veiculos.length / this.MaxPag) || 1;
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
    this.modoEdicao = false;
    this.veiculoEmCadastro = new Veiculo(0, '', '', '');
    this.modalAberto = true;
  }

  abrirModalEdicao(veiculoParaEditar: Veiculo): void {
    this.modoEdicao = true;
    this.veiculoEmCadastro = new Veiculo(
      veiculoParaEditar.id,
      veiculoParaEditar.marca,
      veiculoParaEditar.modelo,
      veiculoParaEditar.placa,
      veiculoParaEditar.disponibilidade
    );
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  salvar(): void {
    if (
      !this.veiculoEmCadastro.marca.trim() ||
      !this.veiculoEmCadastro.modelo.trim() ||
      !this.veiculoEmCadastro.placa.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha marca, modelo e placa!'
      });
      return;
    }

    const usuarioLogado = this.authService.usuarioAtual;

    if (!usuarioLogado || !usuarioLogado.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Sessão inválida',
        text: 'Usuário logado não identificado.'
      });
      return;
    }


    this.veiculoEmCadastro.marca = this.veiculoEmCadastro.marca.trim();
    this.veiculoEmCadastro.modelo = this.veiculoEmCadastro.modelo.trim();
    this.veiculoEmCadastro.placa = this.veiculoEmCadastro.placa.trim().toUpperCase();

    if (this.modoEdicao) {
      this.veiculoService
        .update(this.veiculoEmCadastro.id, this.veiculoEmCadastro, usuarioLogado.id)
        .subscribe({
          next: () => {
            this.modalAberto = false;
            this.carregarVeiculos();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Veículo atualizado com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao atualizar veículo:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: erro?.error?.message || 'Não foi possível atualizar o veículo.'
            });
          }
        });
    } else {
      this.veiculoService
        .create(this.veiculoEmCadastro, usuarioLogado.id)
        .subscribe({
          next: () => {
            this.modalAberto = false;
            this.carregarVeiculos();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Veículo cadastrado com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao cadastrar veículo:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: erro?.error?.message || 'Não foi possível cadastrar o veículo.'
            });
          }
        });
    }
  }

  excluir(id: number): void {
    const usuarioLogado = this.authService.usuarioAtual;

    if (!usuarioLogado || !usuarioLogado.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Sessão inválida',
        text: 'Usuário logado não identificado.'
      });
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação removerá o veículo permanentemente do banco de dados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.veiculoService.delete(id, usuarioLogado.id).subscribe({
          next: () => {
            this.carregarVeiculos();
            Swal.fire({
              icon: 'success',
              title: 'Excluído!',
              text: 'Veículo removido com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao excluir veículo:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: erro?.error?.message || 'Não foi possível excluir o veículo.'
            });
          }
        });
      }
    });
  }
}
