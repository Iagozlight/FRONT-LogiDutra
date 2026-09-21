export interface ProdutoRomaneio {
    nome: string;
    quantidade: number;
}

export class Romaneio {
    id: number;
    data: Date;
    produtoList: ProdutoRomaneio[];

    constructor(id: number, data: Date | string, produtoList: ProdutoRomaneio[]) {
        this.id = id;
        this.data = data instanceof Date ? data : new Date(data);
        this.produtoList = produtoList;
    }
}
