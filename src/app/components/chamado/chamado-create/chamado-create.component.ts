import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Chamado } from "src/app/models/chamado";
import { AuthService } from "src/app/services/auth.service";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-chamado-create",
  templateUrl: "./chamado-create.component.html",
  styleUrls: ["./chamado-create.component.css"],
})
export class ChamadoCreateComponent implements OnInit {
  chamado: Chamado = {
    prioridade: "",
    status: "",
    titulo: "",
    observacoes: "",
    tecnico: "",
    cliente: "",
    nomeCliente: "",
    nomeTecnico: "",
    tecnicoId: null,
    clienteId: null,
  };

  prioridade: FormControl = new FormControl(null, [Validators.required]);
  status: FormControl = new FormControl(null, [Validators.required]);
  titulo: FormControl = new FormControl(null, [Validators.required]);
  observacoes: FormControl = new FormControl(null, [Validators.required]);

  clienteIdentificado = false;

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findClienteLogado();
  }

  create(): void {
    if (!this.clienteIdentificado) {
      this.toastService.error(
        "Erro de permissão: ID do cliente não identificado."
      );
      return;
    }

    this.chamado.prioridade = this.prioridade.value;
    this.chamado.status = this.status.value;
    this.chamado.titulo = this.titulo.value;
    this.chamado.observacoes = this.observacoes.value;

    this.chamado.tecnico = null;
    this.chamado.tecnicoId = null;

    // O ID do cliente já foi setado no findClienteLogado
    this.chamado.clienteId = this.chamado.cliente;

    console.log("Enviando chamado:", this.chamado);

    this.chamadoService.create(this.chamado).subscribe({
      next: (response) => {
        this.toastService.success("Chamado criado com sucesso", "Novo chamado");
        this.router.navigate(["chamados"]);
      },
      error: (ex) => {
        console.log(ex);
        if (ex.error.errors) {
          ex.error.errors.forEach((element: any) => {
            this.toastService.error(element.message);
          });
        } else {
          this.toastService.error(ex.error.message);
        }
      },
    });
  }

  findClienteLogado(): void {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = this.authService.jwtService.decodeToken(token);
      console.log("Token Decodificado:", decoded);

      // Tenta encontrar o ID no token (pode ser 'id', 'userId', 'jti', etc)
      // Se o seu backend não manda o ID no token, isso vai falhar.
      if (decoded && decoded.id) {
        this.chamado.cliente = decoded.id;
        this.clienteIdentificado = true;
        console.log("ID encontrado no token:", decoded.id);
        return;
      }
    }

    // Se não achou no token, tenta buscar pelo email (mas vai dar 403 se o cliente não puder listar)
    const email = this.authService.getEmailFromToken();
    if (email) {
      this.clienteService.findAll().subscribe({
        next: (clientes) => {
          const clienteEncontrado = clientes.find((obj) => obj.email === email);
          if (clienteEncontrado) {
            this.chamado.cliente = clienteEncontrado.id;
            this.clienteIdentificado = true;
          } else {
            this.toastService.error("Cliente não encontrado.");
          }
        },
        error: (ex) => {
          // Aqui tratamos o erro que você viu na imagem
          console.error("Erro ao buscar cliente:", ex);
          if (ex.status === 403) {
            this.toastService.error(
              "Erro de permissão: Não foi possível identificar seu ID de cliente."
            );
          }
        },
      });
    }
  }

  validaCampos(): boolean {
    return (
      this.prioridade.valid &&
      this.status.valid &&
      this.titulo.valid &&
      this.observacoes.valid &&
      this.clienteIdentificado
    );
  }
}
