import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { Romaneio } from '../../../models/romaneio';
import { AuthService } from '../../../services/auth.service';
import { RomaneioService } from '../../../services/romaneio.service';

export type StatusRomaneio = 'PENDENTE' | 'EM_ROTA' | 'CONCLUIDO';

@Component({
  selector: 'app-romaneios-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './romaneios-list.component.html',
  styleUrl: './romaneios-list.component.scss'
})
export class RomaneiosListComponent implements OnInit {
  lista: Romaneio[] = [];
  paginaAtual = 1;
  readonly maxPaginas = 6;
  carregando = true;
  erro = '';

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly authService = inject(AuthService);
  private readonly romaneioService = inject(RomaneioService);

  ngOnInit(): void {
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
    if (!this.authService.ehAdmin) return;

    this.router.navigate(['/admin/romaneios/edit', romaneio.id], {
      state: { romaneio }
    });
  }

  excluir(romaneio: Romaneio): void {
    if (!this.authService.ehAdmin) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse romaneio será excluído.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    }).then(resultado => {
      if (!resultado.isConfirmed) return;

      this.romaneioService
        .delete(romaneio.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            localStorage.removeItem(`romaneio-status:${romaneio.id}`);
            localStorage.removeItem(`romaneio-detalhes:${romaneio.id}`);
            Swal.fire('Sucesso!', 'Romaneio excluído com sucesso.', 'success');
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
    });
  }

  carregarRomaneios(): void {
    this.carregando = true;
    this.erro = '';

    this.romaneioService
      .listAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (romaneios: Romaneio[]) => {
          this.lista = romaneios;

          if (this.paginaAtual > this.totalPaginas) {
            this.paginaAtual = this.totalPaginas;
          }

          this.carregando = false;
        },
        error: (erro: HttpErrorResponse) => {
          this.lista = [];
          this.carregando = false;
          this.erro =
            erro.status === 0
              ? 'Não foi possível conectar ao servidor.'
              : 'Não foi possível carregar os romaneios.';
        }
      });
  }

  obterStatusRomaneio(id: number): StatusRomaneio {
    const statusDireto = localStorage.getItem(`romaneio-status:${id}`) as StatusRomaneio;
    if (statusDireto) {
      return statusDireto;
    }

    const detalhesSalvos = localStorage.getItem(`romaneio-detalhes:${id}`);
    if (detalhesSalvos) {
      try {
        const detalhes = JSON.parse(detalhesSalvos);
        if (detalhes.clientes && detalhes.clientes.length > 0) {
          const todosFinalizados = detalhes.clientes.every((c: any) => c.status === 'finalizado');
          if (todosFinalizados) return 'CONCLUIDO';

          const algumEmAndamento = detalhes.clientes.some(
            (c: any) => c.status === 'caminho' || c.status === 'finalizado'
          );
          if (algumEmAndamento) return 'EM_ROTA';
        }
      } catch (e) {
        console.error('Erro ao ler detalhes do romaneio', e);
      }
    }

    return 'PENDENTE';
  }

  obterLabelStatus(status: StatusRomaneio): string {
    switch (status) {
      case 'CONCLUIDO':
        return 'Concluído';
      case 'EM_ROTA':
        return 'Em Rota';
      default:
        return 'Pendente';
    }
  }

  obterClasseStatus(status: StatusRomaneio): string {
    switch (status) {
      case 'CONCLUIDO':
        return 'status-concluido';
      case 'EM_ROTA':
        return 'status-em-rota';
      default:
        return 'status-pendente';
    }
  }
}
