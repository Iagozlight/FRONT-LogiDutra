import { Injectable } from '@angular/core';
import { Veiculo } from '../models/veiculos';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private readonly chave = 'veiculos';

  listar(): Veiculo[] {
    const salvo = sessionStorage.getItem(this.chave);
    return salvo ? JSON.parse(salvo) as Veiculo[] : [];
  }

  buscarPorPlaca(placa: string): Veiculo | undefined {
    return this.listar().find(item => item.placa === placa);
  }

  salvar(veiculos: Veiculo[]): void {
    sessionStorage.setItem(this.chave, JSON.stringify(veiculos));
  }

  adicionar(novoVeiculo: Veiculo): void {
    const veiculos = this.listar();
    veiculos.push(novoVeiculo);
    this.salvar(veiculos);
  }

  atualizarDisponibilidade(placa: string, disponivel: boolean): void {
    const veiculos = this.listar();
    const item = veiculos.find(veiculoAtual => veiculoAtual.placa === placa);
    if (item) {
      item.disponibilidade = disponivel;
      this.salvar(veiculos);
    }
  }
}
