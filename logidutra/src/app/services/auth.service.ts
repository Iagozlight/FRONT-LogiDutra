import { Injectable } from '@angular/core';
import { usuario } from '../models/usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly chaveSessao = 'usuarioLogado';

  get usuarioAtual(): usuario {
    const usuarioSalvo = sessionStorage.getItem(this.chaveSessao);
    return usuarioSalvo ? JSON.parse(usuarioSalvo) as usuario : new usuario(0, '', '', 0, '');
  }

  get estaAutenticado(): boolean {
    return !!sessionStorage.getItem(this.chaveSessao);
  }

  get ehAdmin(): boolean {
    // Normaliza para maiúsculas para evitar falha entre 'ADMIN' e 'Admin'
    return this.usuarioAtual?.role?.toUpperCase() === 'ADMIN';
  }

  entrar(usuarioLogado: usuario): void {
    sessionStorage.setItem(this.chaveSessao, JSON.stringify(usuarioLogado));
  }

  sair(): void {
    sessionStorage.removeItem(this.chaveSessao);
  }
}
