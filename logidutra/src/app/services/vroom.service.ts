import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Rota } from '../models/rota';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VroomService {
  coordenadas:[number, number] = [0, 0];

  private readonly API = "http://localhost:3000/";
  private readonly http = inject(HttpClient);

  getRotaOtimizada(rota:Rota):Observable<any>{
    return this.http.post<any>(this.API, rota);
  }

  async getCordenadas(endereco:String, numero:number){
      const query = encodeURIComponent(`${endereco}`);

      return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then((result)=>{return result.json()})
      .then((result)=>{
        
        this.coordenadas[0] = parseFloat(result[0].lat);
        this.coordenadas[1] = parseFloat(result[0].lon);

        return this.coordenadas;
      })
  }
}
