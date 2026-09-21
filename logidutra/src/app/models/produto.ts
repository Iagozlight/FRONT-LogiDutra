import { Romaneio } from './romaneio';

export class produto {
    id!: number;
    nome!: string;
    preco!: number;
    romaneios?: Romaneio;

    constructor(
        id: number,
        nome: string,
        preco: number,
        romaneios?: Romaneio
    ) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.romaneios = romaneios;
    }
}
