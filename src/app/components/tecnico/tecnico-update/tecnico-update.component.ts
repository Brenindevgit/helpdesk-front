import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Tecnico } from "src/app/models/tecnico";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-tecnico-update",
  templateUrl: "./tecnico-update.component.html",
  styleUrls: ["./tecnico-update.component.css"],
})
export class TecnicoUpdateComponent implements OnInit {
  tecnico: Tecnico = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "",
  };

  // Validadores dos campos (Reactive Forms)
  nome = new FormControl(null, Validators.minLength(3));
  cpf = new FormControl(null, Validators.required);
  email = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Pega o ID da URL (ex: /tecnicos/update/1)
    this.tecnico.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe((resposta) => {
      this.tecnico = resposta;
      // Preenche os controles do formulário com os dados vindos do banco
      // (Necessário para a validação inicial funcionar corretamente)
      this.nome.setValue(this.tecnico.nome);
      this.cpf.setValue(this.tecnico.cpf);
      this.email.setValue(this.tecnico.email);
      // A senha não vem do banco (por segurança), então limpamos ou deixamos vazio para nova senha
      this.senha.setValue("");
    });
  }

  update(): void {
    // Atualiza o objeto com os valores dos campos antes de enviar
    this.tecnico.nome = this.nome.value;
    this.tecnico.cpf = this.cpf.value;
    this.tecnico.email = this.email.value;
    this.tecnico.senha = this.senha.value;

    this.service.update(this.tecnico).subscribe(
      () => {
        this.toast.success("Técnico atualizado com sucesso", "Atualização");
        this.router.navigate(["tecnicos"]);
      },
      (ex: any) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: any) => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      }
    );
  }

  addPerfil(perfil: any): void {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

  validaCampos(): boolean {
    return (
      this.nome.valid &&
      this.cpf.valid &&
      this.email.valid &&
      this.senha.valid &&
      this.tecnico.perfis.length > 0
    );
  }
}
