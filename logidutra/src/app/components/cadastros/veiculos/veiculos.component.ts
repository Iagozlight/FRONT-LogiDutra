import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { veiculo } from '../../../models/veiculos';

@Component({
  selector: 'app-veiculos',
  imports: [RouterLink],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export class VeiculosComponent {
  veiculos: veiculo[] = [];
  paginaAtual = 1;
  MaxPag = 6;

  constructor() {
    const veiculosSalvos = sessionStorage.getItem('veiculos');
    this.veiculos = veiculosSalvos ? JSON.parse(veiculosSalvos) : [];
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
}
