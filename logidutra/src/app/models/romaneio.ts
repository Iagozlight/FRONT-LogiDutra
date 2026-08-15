export class Romaneio {

    id!: number;
    veiculo!: string;
    motorista!: string;
    rota!: string;
    data!: string;
    atividade!: string;

    constructor(id: number, veiculo: string, motorista: string, rota: string, data: string, atividade: string) {
        this.id = id;
        this.veiculo = veiculo;
        this.motorista = motorista;
        this.rota = rota;
        this.data = data;
        this.atividade = atividade;
    }
}
