import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Romaneio } from '../models/romaneio';

export interface RomaneiosRequestDTO {
  id?: number;
  data: string;
  veiculoId: number;
  usuarioId: number;
  clienteId: number[];
  produtoId?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RomaneioService {

  private readonly API = '/api/logidutra/romaneios';
  private readonly http = inject(HttpClient);

  listAll(): Observable<Romaneio[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(romaneios => (Array.isArray(romaneios) ? romaneios : []).map(r => this.normalizarRomaneio(r)))
    );
  }

  findById(id: number): Observable<Romaneio> {
    return this.http.get<any>(`${this.API}/buscar/${id}`).pipe(
      map(r => this.normalizarRomaneio(r))
    );
  }

  create(dto: RomaneiosRequestDTO): Observable<Romaneio> {
    return this.http.post<any>(`${this.API}/salvar`, dto).pipe(
      map(romaneioCriado => this.normalizarRomaneio(romaneioCriado))
    );
  }

  update(id: number, dto: RomaneiosRequestDTO): Observable<Romaneio> {
    const params = new HttpParams().set('id', id);
    return this.http.put<any>(`${this.API}/atualizar`, dto, { params }).pipe(
      map(romaneioAtualizado => this.normalizarRomaneio(romaneioAtualizado))
    );
  }

  updateParcial(id: number, dto: Partial<RomaneiosRequestDTO>): Observable<Romaneio> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<any>(`${this.API}/atualizar`, dto, { params }).pipe(
      map(romaneioAtualizado => this.normalizarRomaneio(romaneioAtualizado))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/deletar/${id}`);
  }

  // Utilitário para formatar a data do Angular (YYYY-MM-DD ou Date) para dd/MM/yyyy exigido pelo Java
  formatarDataParaBackend(dataInput: Date | string): string {
    const d = new Date(dataInput);
    if (isNaN(d.getTime())) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private normalizarRomaneio(r: any): Romaneio {
  return new Romaneio(
    Number(r?.id) || 0,
    r?.data ? this.converterDataJavaParaJS(r.data) : new Date(),
    Array.isArray(r?.produtoList) ? r.produtoList : (Array.isArray(r?.produtos) ? r.produtos : []),
    r?.veiculo || null,
    r?.motorista || null,
    Array.isArray(r?.clientes) ? r.clientes : []
  );
}

  private converterDataJavaParaJS(dataStr: string): Date {
    if (typeof dataStr === 'string' && dataStr.includes('/')) {
      const [dia, mes, ano] = dataStr.split('/');
      return new Date(Number(ano), Number(mes) - 1, Number(dia));
    }
    return new Date(dataStr);
  }
}
