import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Romaneio } from '../models/romaneio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RomaneioService {

  API = "/api/logidutra/romaneios";

  http = inject(HttpClient);

  listAll():Observable<Romaneio[]>{
    return this.http.get<Romaneio[]>(`${this.API}/`);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${this.API}/deletar/${id}`);
  }

  update(id:number, romaneio:Romaneio):Observable<Romaneio>{
    return this.http.put<Romaneio>(`${this.API}/atualizar/${id}`, romaneio);
  }

  create(romaneio:Romaneio):Observable<Romaneio>{
    return this.http.post<Romaneio>(`${this.API}/salvar/`, romaneio);
  }

  findById(id:number):Observable<Romaneio>{
    return this.http.get<Romaneio>(`${this.API}/buscar/${id}`);
  }
}
