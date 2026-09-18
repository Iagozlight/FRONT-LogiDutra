export class usuario {

    id!: number;
    nome!: string;
    senha!: string;
    idade!: number;
    role!: string;
    Disp: boolean = false;
    static padrao(): usuario {
        return new usuario(1, 'admin', 'admin', 0, 'Admin');
    }


    constructor(id: number, nome: string, senha: string, idade: number, role: string, Disp: boolean = false) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.idade = idade;
        this.role = role;
        this.Disp = Disp;
    }
}
