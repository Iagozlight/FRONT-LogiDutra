import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuario } from '../models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  API = "/api/logidutra/usuario";

  http = inject(HttpClient);

  listAll():Observable<usuario[]>{
    return this.http.get<usuario[]>(this.API);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${this.API}/${id}`);
  }

  update(id:number, marca:usuario):Observable<usuario>{
    return this.http.put<usuario>(`${this.API}/${id}`, marca);
  }

  create(marca:usuario):Observable<usuario>{
    return this.http.post<usuario>(`${this.API}`, marca);
  }
}
