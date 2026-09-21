export class cliente {
    id!: number;
    nome!: string;
    cpf!: string;
    telefone!: string;
    cep!: string;
    logradouro!: string;
    bairro!: string;
    cidade!: string;

    constructor(
        id: number,
        nome: string,
        cpf: string,
        telefone: string,
        cep: string,
        logradouro: string,
        bairro: string,
        cidade: string
    ) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.cidade = cidade;
    }
}
