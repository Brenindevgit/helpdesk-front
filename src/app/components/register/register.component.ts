import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Cliente } from "src/app/models/cliente";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  // Inicializamos com 'as any' no ID para evitar erro de tipagem
  cliente: Cliente = {
    id: "" as any,
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "" as any,
  };

  // Validadores dos campos
  nome = new FormControl("", [Validators.minLength(3)]);
  cpf = new FormControl("", [Validators.required]);
  email = new FormControl("", [Validators.email]);
  senha = new FormControl("", [Validators.minLength(3)]);

  constructor(
    private router: Router,
    private service: ClienteService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  create(): void {
    // O Backend espera os perfis, mas ele mesmo define como CLIENTE se vier vazio ou errado.
    // Vamos limpar para garantir.
    this.cliente.perfis = [];

    this.service.create(this.cliente).subscribe({
      next: () => {
        this.toast.success("Conta criada com sucesso! Faça login.", "Cadastro");
        this.router.navigate(["login"]);
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: any) => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      },
    });
  }
}
