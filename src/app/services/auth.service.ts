import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { Credenciais } from "../models/credenciais";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: "response",
      responseType: "text",
    });
  }

  successfulLogin(authToken: string) {
    // Remove o prefixo "Bearer " e salva apenas o token
    localStorage.setItem("token", authToken.substring(7));
  }

  isAuthenticated() {
    let token = localStorage.getItem("token");
    if (token != null) {
      return !this.jwtService.isTokenExpired(token);
    }
    return false;
  }

  // Método para pegar o email (subject) do token
  getEmailFromToken(): string {
    let token = localStorage.getItem("token");
    if (token) {
      let decodedToken = this.jwtService.decodeToken(token);
      return decodedToken ? decodedToken.sub : "";
    }
    return "";
  }

  // Verifica permissões (roles)
  hasPermission(role: string): boolean {
    let token = localStorage.getItem("token");
    if (token) {
      let decodedToken = this.jwtService.decodeToken(token);
      // Verifica se o token foi decodificado e se tem roles
      return (
        decodedToken && decodedToken.roles && decodedToken.roles.includes(role)
      );
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }
}
