export class usuario {
  id!: number;
  nome!: string;
  senha?: string;
  idade!: number;
  role!: string;
  status?: string;

  constructor(
    id: number = 0,
    nome: string = '',
    senha?: string,
    idade: number = 0,
    role: string = '',
    status?: string
  ) {
    this.id = id;
    this.nome = nome;
    this.senha = senha;
    this.idade = idade;
    this.role = role;
    this.status = status;
  }

  static padrao(): usuario {
    return new usuario(1, 'admin', 'admin', 0, 'Admin', 'DISPONIVEL');
  }
}
