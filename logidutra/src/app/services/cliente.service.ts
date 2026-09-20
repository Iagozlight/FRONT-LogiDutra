import { HttpClient } from '@angular/common/http';
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

  create(novoCliente: cliente): Observable<cliente> {
    return this.http.post<cliente>(this.API, novoCliente);
  }
}
