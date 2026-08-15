export class ItemEntrega {

    cliente!: string;
    itemComprado!: string;
    endereco!: string;

    constructor(cliente: string, itemComprado: string, endereco: string) {
        this.cliente = cliente;
        this.itemComprado = itemComprado;
        this.endereco = endereco;
    }
}
