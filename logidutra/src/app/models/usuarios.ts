export class usuario {
    id!: number;
    nome!: string;
    senha!: string;
    email!: string;
    admin!: boolean;

    constructor(id: number, nome: string, senha: string, email: string, admin: boolean) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.email = email;
        this.admin = admin;
    }
}
