import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { usuario } from '../../../models/usuarios';
import { UsuarioService } from '../../../services/usuario-service.service';
import { AuthService } from '../../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarios: usuario[] = [];

  paginaAtual = 1;
  MaxPag = 6;

  usuarioService = inject(UsuarioService);
  authService = inject(AuthService);

  usuarioEmCadastro = new usuario();
  modalAberto = false;
  modoEdicao = false;

  constructor() {
    this.carregarUsuarios();
  }

  traduzirStatus(status?: string): string {
    switch (status) {
      case 'DISPONIVEL': return 'Disponível';
      case 'EM_ROTA': return 'Em rota';
      default: return '-';
    }
  }

  carregarUsuarios(): void {
    this.usuarioService.listAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (erro) => {
        console.error('Erro ao carregar usuários:', erro);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível carregar os usuários.'
        });
      }
    });
  }

  get usuariosPaginados(): usuario[] {
    const inicio = (this.paginaAtual - 1) * this.MaxPag;
    return this.usuarios.slice(inicio, inicio + this.MaxPag);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.MaxPag) || 1;
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
    this.usuarioEmCadastro = new usuario();
    this.modalAberto = true;
  }

  abrirModalEdicao(usuarioParaEditar: usuario): void {
    this.modoEdicao = true;
    // Cria uma cópia dos dados para não alterar a tabela antes de salvar
    this.usuarioEmCadastro = new usuario(
      usuarioParaEditar.id,
      usuarioParaEditar.nome,
      '', // Senha mantida vazia na edição
      usuarioParaEditar.idade,
      usuarioParaEditar.role,
      usuarioParaEditar.status
    );
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  salvar(): void {
    if (!this.usuarioEmCadastro.nome.trim() || !this.usuarioEmCadastro.role) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha o nome e a role!'
      });
      return;
    }

    if (!this.modoEdicao && !this.usuarioEmCadastro.senha) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Informe uma senha para o novo usuário!'
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

    if (this.modoEdicao) {
      // Edição (PUT)
      this.usuarioService
        .update(this.usuarioEmCadastro.id, this.usuarioEmCadastro, usuarioLogado.id)
        .subscribe({
          next: () => {
            this.modalAberto = false;
            this.carregarUsuarios();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Usuário atualizado com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao atualizar usuário:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: erro?.error?.message || 'Não foi possível atualizar o usuário.'
            });
          }
        });
    } else {
      // Criação (POST)
      const novoUsuario = new usuario(
        0,
        this.usuarioEmCadastro.nome.trim(),
        this.usuarioEmCadastro.senha,
        this.usuarioEmCadastro.idade,
        this.usuarioEmCadastro.role
      );

      this.usuarioService
        .create(novoUsuario, usuarioLogado.id)
        .subscribe({
          next: () => {
            this.modalAberto = false;
            this.carregarUsuarios();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Usuário cadastrado com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao cadastrar usuário:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: erro?.error?.message || 'Não foi possível cadastrar o usuário.'
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

    if (id === usuarioLogado.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Ação não permitida',
        text: 'Você não pode excluir o usuário que está atualmente logado.'
      });
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação removerá o usuário permanentemente do banco de dados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(id, usuarioLogado.id).subscribe({
          next: () => {
            this.carregarUsuarios();
            Swal.fire({
              icon: 'success',
              title: 'Excluído!',
              text: 'Usuário removido com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (erro) => {
            console.error('Erro ao excluir usuário:', erro);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: erro?.error?.message || 'Não foi possível excluir o usuário.'
            });
          }
        });
      }
    });
  }
}
