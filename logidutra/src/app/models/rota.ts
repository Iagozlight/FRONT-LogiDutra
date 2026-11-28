
import { Veiculo } from "./veiculos";

export interface Vehicle{
    id:number;
    profile:string;
    start:[number, number];
}
export interface Job{
    id:Number;
    location:[number, number];
}

export class Rota {
    vehicles:Vehicle[] = [];
    jobs:Job[] = []
    options = {g: true};

    constructor(veiculo:Veiculo, entregasCords:[number, number][], posicaoInicial:[number, number]){
        this.vehicles.push({"id":veiculo.id, "profile":"driving-hgv", "start":posicaoInicial});

        for(let i = 0; i < entregasCords.length; i++){
            this.jobs.push({"id": i, "location": [entregasCords[i][1], entregasCords[i][0]]});
        }
    }
}
