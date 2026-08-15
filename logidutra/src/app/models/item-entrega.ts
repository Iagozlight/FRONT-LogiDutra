export class ItemEntrega {
    id!: number;
    cliente!: string;
    itemComprado!: string;
    endereco!: string;

    constructor(id: number, cliente: string, itemComprado: string, endereco: string) {
        this.id = id;
        this.cliente = cliente;
        this.itemComprado = itemComprado;
        this.endereco = endereco;
    }
}
