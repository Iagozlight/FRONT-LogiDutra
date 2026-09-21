import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { veiculo } from '../../../models/veiculos';
import { VeiculoService } from '../../../services/veiculo.service';

@Component({
  selector: 'app-veiculos',
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export class VeiculosComponent {
  veiculos: veiculo[] = [];
  paginaAtual = 1;
  MaxPag = 6;
  veiculoService = inject(VeiculoService);
  veiculoEmCadastro = new veiculo(0, '', '', '');
  modalAberto = false;

  constructor() {
    this.veiculos = this.veiculoService.listar();
  }

  get veiculosPaginados(): veiculo[] {
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
    this.veiculoEmCadastro = new veiculo(0, '', '', '');
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  cadastrar(): void {
    if (!this.veiculoEmCadastro.marca.trim() || !this.veiculoEmCadastro.modelo.trim() || !this.veiculoEmCadastro.placa.trim()) {
      alert('Preencha marca, modelo e placa!');
      return;
    }

    const veiculos = this.veiculoService.listar();
    const placa = this.veiculoEmCadastro.placa.trim().toUpperCase();
    if (veiculos.some(veiculoAtual => veiculoAtual.placa.toUpperCase() === placa)) {
      alert('Já existe um veículo com essa placa!');
      return;
    }

    this.veiculoEmCadastro.id = Math.max(...veiculos.map(veiculoAtual => veiculoAtual.id), 0) + 1;
    this.veiculoEmCadastro.marca = this.veiculoEmCadastro.marca.trim();
    this.veiculoEmCadastro.modelo = this.veiculoEmCadastro.modelo.trim();
    this.veiculoEmCadastro.placa = placa;
    this.veiculoEmCadastro.disponibilidade = false;
    this.veiculoService.adicionar(this.veiculoEmCadastro);
    this.veiculos = this.veiculoService.listar();
    this.modalAberto = false;
  }
}
