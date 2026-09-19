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

export class ItemEntrega {
    id!: number;
    cliente!: string;
    itemComprado!: string;
    endereco!: string;
    veiculo!: string;
    motorista!: string;
    clientes: ClienteEntrega[] = [];
    produtos: ProdutoEntrega[] = [];

    constructor(id: number, cliente: string, itemComprado: string, endereco: string, veiculo: string, motorista: string = '') {
        this.id = id;
        this.cliente = cliente;
        this.itemComprado = itemComprado;
        this.endereco = endereco;
        this.veiculo = veiculo;
        this.motorista = motorista;
        this.clientes = cliente ? [{ nome: cliente, endereco, produtos: itemComprado ? [{ nome: itemComprado, quantidade: 1 }] : [], finalizado: true }] : [];
        this.produtos = itemComprado ? [{ nome: itemComprado, quantidade: 1 }] : [];
    }
}
