import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API = 'http://localhost:8080/api/logidutra/cliente';
  private readonly http = inject(HttpClient);

  listAll(): Observable<cliente[]> {
    return this.http.get<cliente[]>(this.API).pipe(
      map(clientes => (Array.isArray(clientes) ? clientes : []).map(c => this.normalizarCliente(c)))
    );
  }

  findById(id: number): Observable<cliente> {
    return this.http.get<cliente>(`${this.API}/${id}`).pipe(
      map(c => this.normalizarCliente(c))
    );
  }

  create(novoCliente: cliente, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    const payload = this.prepararPayloadParaSalvar(novoCliente);

    return this.http.post<cliente>(this.API, payload, { params }).pipe(
      map(c => this.normalizarCliente(c))
    );
  }

  update(id: number, clienteObj: cliente, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);

    return this.http.put<cliente>(this.API, clienteObj, { params }).pipe(
      map(c => this.normalizarCliente(c))
    );
  }

  updateParcial(id: number, clienteObj: Partial<cliente>, usuarioLogadoId: number): Observable<cliente> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);

    return this.http.patch<cliente>(this.API, clienteObj, { params }).pipe(
      map(c => this.normalizarCliente(c))
    );
  }

  delete(id: number, usuarioLogadoId: number): Observable<void> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    return this.http.delete<void>(`${this.API}/${id}`, { params });
  }

  private prepararPayloadParaSalvar(c: cliente): Partial<cliente> {
    const { id, ...resto } = c;
    // Se o ID for <= 0, removemos o campo para a API gerar a chave primária no banco
    return id && id > 0 ? c : resto;
  }

  private normalizarCliente(c: Partial<cliente>): cliente {
    return {
      id: Number(c.id) || 0,
      nome: c.nome ?? '',
      cpf: c.cpf ?? '',
      telefone: c.telefone ?? '',
      cep: c.cep ?? '',
      logradouro: c.logradouro ?? '',
      bairro: c.bairro ?? '',
      cidade: c.cidade ?? ''
    } as cliente;
  }
}
