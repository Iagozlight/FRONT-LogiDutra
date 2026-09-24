import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/veiculos';

@Injectable({
  providedIn: 'root'
})
export class VeiculoHttpService {

  private readonly API = 'http://localhost:8080/api/logidutra/veiculo';
  private http = inject(HttpClient);

  listAll(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.API);
  }

  findById(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.API}/${id}`);
  }

  create(Veiculo: Veiculo, usuarioLogadoId: number): Observable<Veiculo> {
    return this.http.post<Veiculo>(
      `${this.API}?usuarioLogadoId=${usuarioLogadoId}`,
      Veiculo
    );
  }

  update(id: number, Veiculo: Veiculo, usuarioLogadoId: number): Observable<Veiculo> {
    return this.http.put<Veiculo>(
      `${this.API}?id=${id}&usuarioLogadoId=${usuarioLogadoId}`,
      Veiculo
    );
  }

  updatePartial(id: number, Veiculo: Veiculo, usuarioLogadoId: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(
      `${this.API}?id=${id}&usuarioLogadoId=${usuarioLogadoId}`,
      Veiculo
    );
  }

  markOnRoute(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(
      `${this.API}/${id}/em-rota`,
      {}
    );
  }

  markAvailable(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(
      `${this.API}/${id}/disponivel`,
      {}
    );
  }

  delete(id: number, usuarioLogadoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/${id}?usuarioLogadoId=${usuarioLogadoId}`
    );
  }
}

