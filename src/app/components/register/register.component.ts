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
  // Objeto cliente inicializado vazio
  cliente: Cliente = {
    id: "" as any,
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "" as any,
  };

  // Controles do Formulário (Validadores)
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
    // PASSOS ADICIONADOS:
    // Pegamos os valores digitados nos inputs (FormControls)
    // e jogamos dentro do objeto 'cliente' manualmente.
    this.cliente.nome = this.nome.value;
    this.cliente.cpf = this.cpf.value;
    this.cliente.email = this.email.value;
    this.cliente.senha = this.senha.value;

    // Limpamos os perfis para garantir que o Backend defina como CLIENTE padrão
    this.cliente.perfis = [];

    // Envia para o serviço
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
