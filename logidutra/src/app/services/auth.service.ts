import { Injectable } from '@angular/core';
import { usuario } from '../models/usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly chaveSessao = 'usuarioLogado';

  get usuarioAtual(): usuario | null {
    const usuarioSalvo = sessionStorage.getItem(this.chaveSessao);
    return usuarioSalvo ? JSON.parse(usuarioSalvo) as usuario : null;
  }

  get estaAutenticado(): boolean {
    return this.usuarioAtual !== null;
  }

  get ehAdmin(): boolean {
    return this.usuarioAtual?.role === 'Admin';
  }

  entrar(usuarioLogado: usuario): void {
    sessionStorage.setItem(this.chaveSessao, JSON.stringify(usuarioLogado));
  }

  sair(): void {
    sessionStorage.removeItem(this.chaveSessao);
  }
}
