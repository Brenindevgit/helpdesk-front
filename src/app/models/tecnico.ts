export interface Tecnico {
  id?: any;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfis: any[]; // <--- MUDANÇA AQUI (de string[] para any[])
  dataCriacao: any;
}
