import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API = '/api/logidutra/cliente';
  private readonly http = inject(HttpClient);

  listAll(): Observable<cliente[]> {
    return this.http.get<cliente[]>(this.API);

  }
  findById(id: number): Observable<cliente> {
    return this.http.get<cliente>(`${this.API}/${id}`);
  }

  create(novoCliente: cliente, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    return this.http.post<cliente>(this.API, novoCliente, { params });

  }

  update(id: number, clienteObj: cliente, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);
    return this.http.put<cliente>(this.API, clienteObj, {params});
  }

  updateParcial(id: number, clienteObj: Partial<cliente>, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);
    return this.http.patch<cliente>(this.API, clienteObj, { params });
  }

  delete(id: number, usuarioLogadoId: number): Observable<void> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    return this.http.delete<void>(`${this.API}/${id}`, { params });
  }
}
