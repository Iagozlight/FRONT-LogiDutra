import { Injectable } from '@angular/core';
import { ClienteEntrega, ItemEntrega, StatusRomaneio } from '../models/item-entrega';

@Injectable({ providedIn: 'root' })
export class RomaneioService {
  private readonly chave = 'romaneios';

  listar(): ItemEntrega[] {
    const salvo = sessionStorage.getItem(this.chave);
    const romaneios = salvo ? JSON.parse(salvo) as ItemEntrega[] : this.criarDadosIniciais();
    const normalizados = romaneios.map(romaneio => this.normalizar(romaneio));
    this.salvar(normalizados);
    return normalizados;
  }

  buscarPorId(id: number): ItemEntrega | undefined {
    return this.listar().find(romaneio => romaneio.id === id);
  }

  adicionar(romaneio: ItemEntrega): ItemEntrega {
    const lista = this.listar();
    const proximoId = lista.length ? Math.max(...lista.map(item => item.id)) + 1 : 1;
    const novoRomaneio = this.normalizar({ ...romaneio, id: proximoId });
    lista.push(novoRomaneio);
    this.salvar(lista);
    return novoRomaneio;
  }

  atualizar(romaneio: ItemEntrega): void {
    const lista = this.listar();
    const indice = lista.findIndex(item => item.id === romaneio.id);
    if (indice >= 0) {
      lista[indice] = this.normalizar(romaneio);
      this.salvar(lista);
    }
  }

  atualizarStatus(id: number, status: StatusRomaneio): void {
    const romaneio = this.buscarPorId(id);
    if (romaneio) {
      romaneio.status = status;
      this.atualizar(romaneio);
    }
  }

  excluir(id: number): void {
    this.salvar(this.listar().filter(romaneio => romaneio.id !== id));
  }

  normalizar(romaneio: ItemEntrega): ItemEntrega {
    const clientesSalvos = romaneio.clientes || [];
    const clientes = (clientesSalvos.length ? clientesSalvos : this.criarClientesLegados(romaneio)).map(cliente => ({
      ...cliente,
      produtos: (cliente.produtos || []).map(produto =>
        typeof produto === 'string'
          ? { nome: produto, quantidade: 1 }
          : { ...produto, quantidade: produto.quantidade || 1 }
      )
    })) as ClienteEntrega[];

    return {
      ...romaneio,
      clientes,
      produtos: clientes.flatMap(cliente => cliente.produtos),
      status: (romaneio.status as string) === 'Programado' ? 'Preparado' : (romaneio.status || 'Preparado')
    };
  }

  private criarClientesLegados(romaneio: ItemEntrega): ClienteEntrega[] {
    const nomes = (romaneio.cliente || '').split(',').map(nome => nome.trim()).filter(Boolean);
    const produtos = (romaneio.itemComprado || '').split(',').map(nome => nome.trim()).filter(Boolean)
      .map(nome => ({ nome: nome.replace(/\s*\(\d+x\)$/, ''), quantidade: 1 }));

    return nomes.map(nome => ({
      nome,
      endereco: romaneio.endereco || '',
      produtos,
      finalizado: true
    }));
  }

  private salvar(romaneios: ItemEntrega[]): void {
    sessionStorage.setItem(this.chave, JSON.stringify(romaneios));
  }

  private criarDadosIniciais(): ItemEntrega[] {
    return [
      this.criarRomaneio(1, 'Joao Silva', 'Rua Areias, 15 - Foz do Iguacu/PR', [['Roupeiro', 1], ['Sofa', 1], ['Comoda', 2]], 'Renault Master', 'Carlos Mendes', 'Em andamento'),
      this.criarRomaneio(2, 'Maria Santos', 'Rua Lagos, 222 - Foz do Iguacu/PR', [['Mesa', 1], ['Cadeiras', 6]], 'Mercedes-Benz Sprinter', 'Rafael Souza', 'Preparado'),
      this.criarRomaneio(3, 'Pedro Junior', 'Rua Cacamba, 155 - Foz do Iguacu/PR', [['Painel de TV', 1]], 'Fiat Ducato', 'Marcos Oliveira', 'Encerrado')
    ];
  }

  private criarRomaneio(id: number, nome: string, endereco: string, produtos: [string, number][], veiculo: string, motorista: string, status: StatusRomaneio): ItemEntrega {
    const romaneio = new ItemEntrega(id, nome, '', endereco, veiculo, motorista, status);
    const produtosFormatados = produtos.map(([nomeProduto, quantidade]) => ({ nome: nomeProduto, quantidade }));
    romaneio.clientes = [{ nome, endereco, produtos: produtosFormatados, finalizado: true }];
    romaneio.produtos = produtosFormatados;
    romaneio.itemComprado = produtosFormatados.map(produto => `${produto.nome} (${produto.quantidade}x)`).join(', ');
    return romaneio;
  }
}
