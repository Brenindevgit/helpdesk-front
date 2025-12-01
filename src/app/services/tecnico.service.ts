import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_CONFIG } from "../config/api.config";
import { Tecnico } from "../models/tecnico";

@Injectable({
  providedIn: "root",
})
export class TecnicoService {
  constructor(private http: HttpClient) {}

  // 1. Buscar pelo ID
  findById(id: any): Observable<Tecnico> {
    return this.http.get<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos/${id}`);
  }

  // 2. Listar todos
  findAll(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(`${API_CONFIG.baseUrl}/tecnicos`);
  }

  // 3. Criar
  create(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.post<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos`, tecnico);
  }

  // 4. Atualizar (Este é o método que faltava na sua confirmação)
  update(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.put<Tecnico>(
      `${API_CONFIG.baseUrl}/tecnicos/${tecnico.id}`,
      tecnico
    );
  }

  // 5. Deletar
  delete(id: any): Observable<Tecnico> {
    return this.http.delete<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos/${id}`);
  }
}
