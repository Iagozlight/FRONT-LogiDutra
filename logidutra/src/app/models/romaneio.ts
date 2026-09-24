import { cliente } from "./cliente";
import { usuario } from "./usuarios";
import { Veiculo } from "./veiculos";

export interface ProdutoRomaneio {
    nome: string;
    quantidade: number;
}

export class Romaneio {
    id: number;
    data: Date;
    veiculo: Veiculo;
    motorista: usuario;
    clientes: cliente[];

    produtoList: ProdutoRomaneio[];

    constructor(id: number, data: Date | string, produtoList: ProdutoRomaneio[], veiculo: Veiculo, motorista: usuario, clientes: cliente[]) {
        this.id = id;
        this.data = data instanceof Date ? data : new Date(data);
        this.produtoList = produtoList;
        this.veiculo = veiculo;
        this.motorista = motorista;
        this.clientes = clientes;
    }
}
