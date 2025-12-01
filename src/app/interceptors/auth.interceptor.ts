import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Recupera o token armazenado no localStorage
    let token = localStorage.getItem("token");

    // Se houver um token, clona a requisição e adiciona o cabeçalho de autorização
    if (token) {
      const cloneReq = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${token}`),
      });
      return next.handle(cloneReq);
    } else {
      // Se não houver token, prossegue com a requisição original
      return next.handle(request);
    }
  }
}

// Exporta o provedor do interceptor para ser utilizado no módulo principal
export const AuthInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];
