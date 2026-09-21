export interface ClienteEntrega {
    nome: string;
    endereco: string;
    produtos: ProdutoEntrega[];
    finalizado: boolean;
}

export interface ProdutoEntrega {
    nome: string;
    quantidade: number;
}

export type StatusRomaneio = 'Em andamento' | 'Preparado' | 'Encerrado';

export class Entregas {
    id!: number;
    nom: string;
    preco: number;
    cliente!: string;
    itemComprado!: string;
    endereco!: string;
    veiculo!: string;
    motorista!: string;
    status: StatusRomaneio = 'Preparado';
    clientes: ClienteEntrega[] = [];
    produtos: ProdutoEntrega[] = [];

    constructor(id: number, cliente: string, itemComprado: string, endereco: string, veiculo: string, motorista: string = '', status: StatusRomaneio = 'Preparado', preco: number = 0) {
        this.id = id;
        this.nom = cliente;
        this.preco = preco;
        this.cliente = cliente;
        this.itemComprado = itemComprado;
        this.endereco = endereco;
        this.veiculo = veiculo;
        this.motorista = motorista;
        this.status = status;
        this.clientes = cliente ? [{ nome: cliente, endereco, produtos: itemComprado ? [{ nome: itemComprado, quantidade: 1 }] : [], finalizado: true }] : [];
        this.produtos = itemComprado ? [{ nome: itemComprado, quantidade: 1 }] : [];
    }
}
