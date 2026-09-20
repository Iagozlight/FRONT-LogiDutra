import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Romaneio } from '../../../models/romaneio';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';

interface DetalhesExtrasLista {
  motoristaNome?: string;
  veiculoPlaca?: string;
}

@Component({
  selector: 'app-romaneios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './romaneios-list.component.html',
  styleUrl: './romaneios-list.component.scss'
})
export class RomaneiosListComponent {
  lista: Romaneio[] = [];
  paginaAtual = 1;
  readonly maxPaginas = 6;
  carregando = true;
  erro = '';
  detalhesLocais: Record<number, DetalhesExtrasLista> = {};

  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly romaneioService = inject(RomaneioService);

  constructor() {
    this.carregarRomaneios();
  }

  get listaPaginada(): Romaneio[] {
    const inicio = (this.paginaAtual - 1) * this.maxPaginas;
    return this.lista.slice(inicio, inicio + this.maxPaginas);
  }

  get totalPaginas(): number {
    return Math.ceil(this.lista.length / this.maxPaginas) || 1;
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

  abrirRomaneio(romaneio: Romaneio): void {
    const base = this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios';
    this.router.navigate([base, romaneio.id], { state: { romaneio } });
  }

  editar(romaneio: Romaneio): void {
    if (this.authService.ehAdmin) {
      this.router.navigate(['/admin/romaneios/edit', romaneio.id], { state: { romaneio } });
    }
  }

  excluir(romaneio: Romaneio): void {
    if (!this.authService.ehAdmin) {
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse romaneio será excluído.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then(resultado => {
      if (resultado.isConfirmed) {
        this.romaneioService.delete(romaneio.id).subscribe({
          next: () => {
            this.carregarRomaneios();
          },
          error: () => {
            this.erro = 'Não foi possível excluir o romaneio.';
            Swal.fire({
              title: 'Não foi possível excluir',
              text: 'O backend não conseguiu excluir este romaneio.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }

  carregarRomaneios(): void {
    this.carregando = true;
    this.erro = '';
    this.romaneioService.listAll().subscribe({
      next: romaneios => {
        this.lista = romaneios;
        this.detalhesLocais = this.carregarDetalhesLocais(romaneios);
        if (this.paginaAtual > this.totalPaginas) {
          this.paginaAtual = this.totalPaginas;
        }
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.lista = [];
        this.carregando = false;
        this.erro = erro.status === 0
          ? 'Não foi possível conectar ao servidor.'
          : 'Não foi possível carregar os romaneios.';
      }
    });
  }

  detalheLocal(id: number): DetalhesExtrasLista {
    return this.detalhesLocais[id] ?? {};
  }

  private carregarDetalhesLocais(romaneios: Romaneio[]): Record<number, DetalhesExtrasLista> {
    return romaneios.reduce<Record<number, DetalhesExtrasLista>>((detalhes, romaneio) => {
      const salvo = localStorage.getItem(`romaneio-detalhes:${romaneio.id}`);
      if (salvo) {
        try {
          const extra = JSON.parse(salvo) as DetalhesExtrasLista;
          detalhes[romaneio.id] = extra;
        } catch {
          detalhes[romaneio.id] = {};
        }
      }
      return detalhes;
    }, {});
  }
}
