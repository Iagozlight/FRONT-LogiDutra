export class usuario {
    id!: number;
    nome!: string;
    senha!: string;
    idade!: number;
    role!: string;

    constructor(id: number, nome: string, senha: string, idade: number, role: string) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.idade = idade;
        this.role = role;
    }
}
