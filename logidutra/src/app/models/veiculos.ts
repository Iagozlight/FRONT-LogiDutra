export class Veiculo {
    id!: number;
    marca!: string;
    modelo!: string;
    placa!: string;
    disponibilidade: boolean = false;


    constructor(id: number, marca: string, modelo: string, placa: string, disponibilidade: boolean = false){
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.placa = placa;
        this.disponibilidade = disponibilidade;
    }
}
