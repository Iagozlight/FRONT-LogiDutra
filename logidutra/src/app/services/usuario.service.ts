import { Injectable } from '@angular/core';
import { usuario } from '../models/usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly chave = 'usuarios';

  listar(): usuario[] {
    const salvo = sessionStorage.getItem(this.chave);
    return salvo ? JSON.parse(salvo) as usuario[] : [];
  }

  listarComPadrao(): usuario[] {
    return [usuario.padrao(), ...this.listar()]
      .filter((item, indice, lista) => lista.findIndex(outro => outro.nome === item.nome) === indice);
  }

  salvar(usuarios: usuario[]): void {
    sessionStorage.setItem(this.chave, JSON.stringify(usuarios));
  }

  adicionar(novoUsuario: usuario): void {
    const usuarios = this.listar();
    usuarios.push(novoUsuario);
    this.salvar(usuarios);
  }

  atualizarDisponibilidade(nome: string, disponivel: boolean): void {
    const usuarios = this.listar();
    usuarios.forEach(item => {
      if (item.nome === nome) {
        item.Disp = disponivel;
      }
    });
    this.salvar(usuarios);
  }
}
