import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuario } from '../models/usuarios';

//interfaace que define os dados que o backend retorna quando fazer login
//incluindo o token JWT e informações do usuário
interface LoginResponse {
  token: string;
  id: number;
  nome: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API = 'http://localhost:8080/api/logidutra/usuario';
  private http = inject(HttpClient);

  listAll(): Observable<usuario[]> {
    return this.http.get<usuario[]>(this.API);
  }

  findById(id: number): Observable<usuario> {
    return this.http.get<usuario>(`${this.API}/${id}`);
  }

  create(usuario: usuario, usuarioLogadoId: number): Observable<usuario> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    return this.http.post<usuario>(this.API, usuario, { params });
  }

  update(id: number, usuario: usuario, usuarioLogadoId: number): Observable<usuario> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);
    return this.http.put<usuario>(this.API, usuario, { params });
  }

  updateParcial(id: number, usuario: usuario, usuarioLogadoId: number): Observable<usuario> {
    const params = new HttpParams()
      .set('id', id)
      .set('usuarioLogadoId', usuarioLogadoId);
    return this.http.patch<usuario>(this.API, usuario, { params });
  }


login(nome: string, senha: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    'http://localhost:8080/auth/login',
    {
      login: nome,
      senha: senha
    }
  );
}

  redefinirSenha(nome: string, novaSenha: string): Observable<void> {
  const params = new HttpParams()
    .set('nome', nome)
    .set('novaSenha', novaSenha);

  return this.http.patch<void>(`${this.API}/recuperar-senha`, {}, { params });
}

  marcarEmRota(id: number): Observable<usuario> {
    return this.http.patch<usuario>(`${this.API}/${id}/em-rota`, {});
  }

  marcarDisponivel(id: number): Observable<usuario> {
    return this.http.patch<usuario>(`${this.API}/${id}/disponivel`, {});
  }

  delete(id: number, usuarioLogadoId: number): Observable<void> {
    const params = new HttpParams().set('usuarioLogadoId', usuarioLogadoId);
    return this.http.delete<void>(`${this.API}/${id}`, { params });
  }
}
