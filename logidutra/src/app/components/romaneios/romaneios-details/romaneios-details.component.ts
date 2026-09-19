import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ClienteEntrega, ItemEntrega, ProdutoEntrega } from '../../../models/item-entrega';
import { ActivatedRoute, Router } from '@angular/router';
import { usuario } from '../../../models/usuarios';
import { veiculo } from '../../../models/veiculos';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { VeiculoService } from '../../../services/veiculo.service';
import { RomaneioService } from '../../../services/romaneio.service';

@Component({
  selector: 'app-romaneios-details',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './romaneios-details.component.html',
  styleUrl: './romaneios-details.component.scss'
})
export class RomaneiosDetailsComponent {

  titulo = 'cadastrar nova entrega'

  entrega = new ItemEntrega(0, '', '', '', '');
  clientes: ClienteEntrega[] = [this.novoCliente()];
  veiculos: veiculo[] = [];
  motoristas: usuario[] = [];
  veiculoSelecionado = '';
  motoristaSelecionado = '';

  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);
  veiculoService = inject(VeiculoService);
  romaneioService = inject(RomaneioService);

  constructor(){
    this.carregarOpcoes();
    let id = this.route.snapshot.params['id']
    let entregaRecebida = history.state.entrega;

    if (id > 0){
      this.titulo = 'Editar entrega'
      if (entregaRecebida) {
        this.entrega = {...entregaRecebida};
        this.prepararFormulario();
      } else {
        this.findById(id);
        this.prepararFormulario();
      }
    }
  }

  private carregarOpcoes() {
    this.veiculos = this.veiculoService.listar();
    const usuarios: usuario[] = this.usuarioService.listar();
    this.motoristas = usuarios.filter(usuarioAtual => usuarioAtual.role === 'Motorista');
  }

  private prepararFormulario() {
    const clientesSalvos = this.entrega.clientes as unknown as Array<ClienteEntrega | string>;
    if (clientesSalvos?.length && typeof clientesSalvos[0] !== 'string') {
      this.clientes = (clientesSalvos as ClienteEntrega[]).map(cliente => ({
          nome: cliente.nome,
          endereco: cliente.endereco,
          produtos: (cliente.produtos as unknown as Array<ProdutoEntrega | string>).map(produto =>
            typeof produto === 'string' ? { nome: produto, quantidade: 1 } : { ...produto, quantidade: produto.quantidade || 1 }
          ),
          finalizado: cliente.finalizado ?? true
        }))
    } else {
      this.clientes = this.entrega.cliente.split(',').map(cliente => cliente.trim()).filter(Boolean).map(nome => ({
          nome,
          endereco: this.entrega.endereco,
          produtos: this.entrega.itemComprado.split(',').map(produto => produto.trim()).filter(Boolean).map(nomeProduto => ({ nome: nomeProduto, quantidade: 1 })),
          finalizado: true
        }));
    }
    if (!this.clientes.length) {
      this.clientes = [this.novoCliente()];
    }
    this.veiculoSelecionado = this.entrega.veiculo;
    this.motoristaSelecionado = this.entrega.motorista || '';
  }

  private novoCliente(): ClienteEntrega {
    return { nome: '', endereco: '', produtos: [], finalizado: false };
  }

  adicionarCliente() {
    this.clientes.push(this.novoCliente());
  }

  removerCliente(indice: number) {
    this.clientes.splice(indice, 1);
  }

  adicionarProduto(cliente: ClienteEntrega, produto: string, quantidade: number) {
    const produtoLimpo = produto.trim();
    if (produtoLimpo && quantidade >= 1) {
      cliente.produtos.push({ nome: produtoLimpo, quantidade: Math.floor(quantidade) });
      cliente.finalizado = false;
    }
  }

  removerProduto(cliente: ClienteEntrega, indice: number) {
    cliente.produtos.splice(indice, 1);
    cliente.finalizado = false;
  }

  finalizarCliente(cliente: ClienteEntrega) {
    if (!cliente.nome.trim() || !cliente.endereco.trim() || !cliente.produtos.length) {
      Swal.fire({
        title: 'Cliente incompleto',
        text: 'Informe o nome, o endereço e pelo menos um produto.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
    cliente.finalizado = true;
  }

  findById(id: number){
    this.entrega = this.romaneioService.buscarPorId(id) ?? new ItemEntrega(id, '', '', '', '');
  }

  voltar() {
    this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios']);
  }

  salvar(){
    const clientesInvalidos = this.clientes.some(cliente =>
      !cliente.nome.trim() || !cliente.endereco.trim() || !cliente.produtos.length ||
      cliente.produtos.some(produto => !produto.nome.trim() || produto.quantidade < 1) || !cliente.finalizado
    );
    if (!this.clientes.length || clientesInvalidos ||
      !this.veiculoSelecionado || !this.motoristaSelecionado) {
      Swal.fire({
        title: 'Atenção',
        text: 'Finalize cada cliente com nome, endereço e pelo menos um produto.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });

      return;
    }

    const veiculoAnterior = this.entrega.veiculo;
    this.entrega.clientes = this.clientes.map(cliente => ({
      nome: cliente.nome.trim(),
      endereco: cliente.endereco.trim(),
      produtos: cliente.produtos.map(produto => ({ nome: produto.nome.trim(), quantidade: produto.quantidade })),
      finalizado: true
    }));
    this.entrega.produtos = this.clientes.flatMap(cliente => cliente.produtos);
    this.entrega.cliente = this.clientes.map(cliente => cliente.nome.trim()).join(', ');
    this.entrega.endereco = this.clientes.map(cliente => `${cliente.nome.trim()}: ${cliente.endereco.trim()}`).join(' | ');
    this.entrega.itemComprado = this.entrega.produtos.map(produto => `${produto.nome} (${produto.quantidade}x)`).join(', ');
    this.entrega.veiculo = this.veiculoSelecionado;
    this.entrega.motorista = this.motoristaSelecionado;
    this.atualizarDisponibilidade(veiculoAnterior);

    if (this.entrega.id > 0) {
      this.romaneioService.atualizar(this.entrega);
      Swal.fire({
        title: 'Editado',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios'], {
        state: {}
      });

    } else {
      this.romaneioService.adicionar(this.entrega);
      Swal.fire({
        title: 'Salvo!!!',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      this.router.navigate([this.authService.ehAdmin ? '/admin/romaneios' : '/usuario/romaneios'], {
        state: {}
      });
    }
  }

  private atualizarDisponibilidade(veiculoAnterior: string) {
    if (veiculoAnterior && veiculoAnterior !== this.veiculoSelecionado) {
      this.veiculoService.atualizarDisponibilidade(veiculoAnterior, false);
    }
    this.veiculoService.atualizarDisponibilidade(this.veiculoSelecionado, true);
    this.usuarioService.atualizarDisponibilidade(this.motoristaSelecionado, true);
  }
}
