
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => { //recebe a requisição e o próximo interceptor
  const authService = inject(AuthService);
  const token = authService.token;//busca o token armazenado no AuthService

  if (!token) {
    return next(req);
  }

  const requisicaoComToken = req.clone({//cria uma copia da requisição original e adiciona o token no cabeçalho Authorization
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requisicaoComToken);//retorna  a requisição modificada pro backend
};
