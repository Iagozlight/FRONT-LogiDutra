import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly API = 'http://localhost:8080/api/logidutra/produto';
  private readonly http = inject(HttpClient);

  listAll(): Observable<produto[]> {
    return this.http.get<produto[]>(this.API).pipe(
      map(produtos => (Array.isArray(produtos) ? produtos : []).map(p => this.normalizarProduto(p)))
    );
  }

  findById(id: number): Observable<produto> {
    return this.http.get<produto>(`${this.API}/buscar/${id}`).pipe(
      map(p => this.normalizarProduto(p))
    );
  }

  create(prod: produto): Observable<produto> {
    return this.http.post<produto>(`${this.API}/salvar`, prod).pipe(
      map(produtoCriado => this.normalizarProduto(produtoCriado))
    );
  }

  update(id: number, prod: produto): Observable<produto> {
    const params = new HttpParams().set('id', id);
    return this.http.put<produto>(`${this.API}/atualizar`, prod, { params }).pipe(
      map(produtoAtualizado => this.normalizarProduto(produtoAtualizado))
    );
  }

  updateParcial(id: number, prod: Partial<produto>): Observable<produto> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<produto>(`${this.API}/atualizar`, prod, { params }).pipe(
      map(produtoAtualizado => this.normalizarProduto(produtoAtualizado))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/deletar/${id}`);
  }

  private normalizarProduto(p: Partial<produto>): produto {
    return new produto(
      Number(p.id),
      p.nome ?? '',
      Number(p.preco) || 0,
      p.romaneios
    );
  }
}
