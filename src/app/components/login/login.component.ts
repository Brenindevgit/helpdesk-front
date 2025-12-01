import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Credenciais } from "src/app/models/credenciais";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  creds: Credenciais = {
    email: "",
    senha: "",
  };

  email = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logar() {
    this.creds.email = this.email.value;
    this.creds.senha = this.senha.value;

    this.service.authenticate(this.creds).subscribe(
      (response) => {
        // Pega o token completo (Ex: "Bearer eyJhbGci...")
        let token = response.headers.get("Authorization");

        if (token != null) {
          // CORREÇÃO: Passamos o token INTEIRO.
          // O AuthService já tem o substring(7) lá dentro para remover o "Bearer ".
          this.service.successfulLogin(token);
          this.router.navigate(["home"]);
        } else {
          this.toast.error("Erro: Token não recebido");
        }
      },
      () => {
        this.toast.error("Usuário e/ou senha inválidos");
      }
    );
  }

  validaCampos(): boolean {
    return this.email.valid && this.senha.valid;
  }
}
