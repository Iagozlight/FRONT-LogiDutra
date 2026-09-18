export class ItemEntrega {
    id!: number;
    cliente!: string;
    itemComprado!: string;
    endereco!: string;
    veiculo!: string;

    constructor(id: number, cliente: string, itemComprado: string, endereco: string, veiculo: string) {
        this.id = id;
        this.cliente = cliente;
        this.itemComprado = itemComprado;
        this.endereco = endereco;
        this.veiculo = veiculo;
    }
}
