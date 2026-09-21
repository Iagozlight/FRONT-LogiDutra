import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { veiculo } from '../models/veiculos';

@Injectable({
  providedIn: 'root'
})
export class VeiculoHttpService {

  API = '/api/logidutra/veiculo';

  http = inject(HttpClient);

  listAll(): Observable<veiculo[]> {
    return this.http.get<veiculo[]>(this.API);
  }

  findById(id: number): Observable<veiculo> {
    return this.http.get<veiculo>(`${this.API}/${id}`);
  }

  create(veiculo: veiculo, usuarioLogadoId: number): Observable<veiculo> {
    return this.http.post<veiculo>(
      `${this.API}?usuarioLogadoId=${usuarioLogadoId}`,
      veiculo
    );
  }

  update(id: number, veiculo: veiculo, usuarioLogadoId: number): Observable<veiculo> {
    return this.http.put<veiculo>(
      `${this.API}?id=${id}&usuarioLogadoId=${usuarioLogadoId}`,
      veiculo
    );
  }

  updatePartial(id: number, veiculo: veiculo, usuarioLogadoId: number): Observable<veiculo> {
    return this.http.patch<veiculo>(
      `${this.API}?id=${id}&usuarioLogadoId=${usuarioLogadoId}`,
      veiculo
    );
  }

  markOnRoute(id: number): Observable<veiculo> {
    return this.http.patch<veiculo>(
      `${this.API}/${id}/em-rota`,
      {}
    );
  }

  markAvailable(id: number): Observable<veiculo> {
    return this.http.patch<veiculo>(
      `${this.API}/${id}/disponivel`,
      {}
    );
  }

  delete(id: number, usuarioLogadoId: number): Observable<any> {
    return this.http.delete(
      `${this.API}/${id}?usuarioLogadoId=${usuarioLogadoId}`
    );
  }
}
