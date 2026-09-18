import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { veiculo } from '../../../models/veiculos';

@Component({
  selector: 'app-veiculos-cadastro',
  imports: [MdbFormsModule, FormsModule, RouterLink],
  templateUrl: './veiculos-cadastro.component.html',
  styleUrl: './veiculos-cadastro.component.scss'
})
export class VeiculosCadastroComponent {
  router = inject(Router);
  rotaAtual = inject(ActivatedRoute);
  veiculo = new veiculo(0, '', '', '');

  cadastrar() {
    if (!this.veiculo.marca.trim() || !this.veiculo.modelo.trim() || !this.veiculo.placa.trim()) {
      alert('Preencha marca, modelo e placa!');
      return;
    }

    const veiculosSalvos = sessionStorage.getItem('veiculos');
    const veiculos: veiculo[] = veiculosSalvos ? JSON.parse(veiculosSalvos) : [];
    const placa = this.veiculo.placa.trim().toUpperCase();

    if (veiculos.some(veiculoAtual => veiculoAtual.placa.toUpperCase() === placa)) {
      alert('Já existe um veículo com essa placa!');
      return;
    }

    const maiorId = veiculos.length > 0
      ? Math.max(...veiculos.map(veiculoAtual => veiculoAtual.id))
      : 0;

    this.veiculo.id = maiorId + 1;
    this.veiculo.marca = this.veiculo.marca.trim();
    this.veiculo.modelo = this.veiculo.modelo.trim();
    this.veiculo.placa = placa;
    this.veiculo.disponibilidade = false;
    veiculos.push(this.veiculo);
    sessionStorage.setItem('veiculos', JSON.stringify(veiculos));
    this.router.navigate(['../veiculos'], { relativeTo: this.rotaAtual });
  }
}
