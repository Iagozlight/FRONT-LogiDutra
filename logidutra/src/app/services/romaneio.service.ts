import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Romaneio } from '../models/romaneio';

@Injectable({
  providedIn: 'root'
})
export class RomaneioService {

  private readonly API = '/api/logidutra/romaneios';
  private readonly http = inject(HttpClient);

  listAll(): Observable<Romaneio[]> {
    return this.http.get<Romaneio[]>(this.API).pipe(
      map(romaneios => (Array.isArray(romaneios) ? romaneios : []).map(romaneio => this.normalizarRomaneio(romaneio)))
    );
  }

  findById(id: number): Observable<Romaneio> {
    return this.http.get<Romaneio>(`${this.API}/buscar/${id}`).pipe(
      map(romaneio => this.normalizarRomaneio(romaneio))
    );
  }

  create(romaneio: Romaneio): Observable<Romaneio> {
    return this.http.post<Romaneio>(`${this.API}/salvar`, romaneio).pipe(
      map(romaneioCriado => this.normalizarRomaneio(romaneioCriado))
    );
  }

  update(id: number, romaneio: Romaneio): Observable<Romaneio> {
    const params = new HttpParams().set('id', id);
    return this.http.put<Romaneio>(`${this.API}/atualizar`, romaneio, { params }).pipe(
      map(romaneioAtualizado => this.normalizarRomaneio(romaneioAtualizado))
    );
  }

  updateParcial(id: number, romaneio: Partial<Romaneio>): Observable<Romaneio> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<Romaneio>(`${this.API}/atualizar`, romaneio, { params }).pipe(
      map(romaneioAtualizado => this.normalizarRomaneio(romaneioAtualizado))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/deletar/${id}`);
  }

  private normalizarRomaneio(romaneio: Partial<Romaneio>): Romaneio {
    return new Romaneio(
      Number(romaneio.id),
      romaneio.data ? new Date(romaneio.data) : new Date(),
      Array.isArray(romaneio.produtoList) ? romaneio.produtoList : []
    );
  }
}
