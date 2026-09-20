import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { veiculo } from '../models/veiculos';

@Injectable({
  providedIn: 'root'
})
export class VeiculoHttpService {
  private readonly API = '/api/logidutra/veiculo';
  private readonly http = inject(HttpClient);

  listAll(): Observable<veiculo[]> {
    return this.http.get<veiculo[]>(this.API);
  }
}
