import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Romaneio } from '../models/romaneio';
import { map, Observable } from 'rxjs';

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

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/deletar/${id}`);
  }

  update(id: number, romaneio: Romaneio): Observable<Romaneio> {
    return this.http.put<Romaneio>(`${this.API}/atualizar?id=${id}`, romaneio).pipe(
      map(romaneioAtualizado => this.normalizarRomaneio(romaneioAtualizado))
    );
  }

  create(romaneio: Romaneio): Observable<Romaneio> {
    return this.http.post<Romaneio>(`${this.API}/salvar`, romaneio).pipe(
      map(romaneioCriado => this.normalizarRomaneio(romaneioCriado))
    );
  }

  findById(id: number): Observable<Romaneio> {
    return this.http.get<Romaneio>(`${this.API}/buscar/${id}`).pipe(
      map(romaneio => this.normalizarRomaneio(romaneio))
    );
  }

  private normalizarRomaneio(romaneio: Partial<Romaneio>): Romaneio {
    return new Romaneio(
      Number(romaneio.id),
      romaneio.data ?? new Date(),
      Array.isArray(romaneio.produtoList) ? romaneio.produtoList : []
    );
  }
}
