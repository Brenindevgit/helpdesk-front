import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NavComponent } from "./components/nav/nav.component";
import { TecnicoListComponent } from "./components/tecnico/tecnico-list/tecnico-list.component";
import { TecnicoCreateComponent } from "./components/tecnico/tecnico-create/tecnico-create.component";
import { TecnicoUpdateComponent } from "./components/tecnico/tecnico-update/tecnico-update.component";
import { TecnicoDeleteComponent } from "./components/tecnico/tecnico-delete/tecnico-delete.component";
import { ClienteListComponent } from "./components/cliente/cliente-list/cliente-list.component";
import { ClienteCreateComponent } from "./components/cliente/cliente-create/cliente-create.component";
import { ClienteUpdateComponent } from "./components/cliente/cliente-update/cliente-update.component";
import { ClienteDeleteComponent } from "./components/cliente/cliente-delete/cliente-delete.component";
import { ChamadoListComponent } from "./components/chamado/chamado-list/chamado-list.component";
import { ChamadoCreateComponent } from "./components/chamado/chamado-create/chamado-create.component";
import { ChamadoUpdateComponent } from "./components/chamado/chamado-update/chamado-update.component";
import { ChamadoReadComponent } from "./components/chamado/chamado-read/chamado-read.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },

  {
    path: "",
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "home", component: HomeComponent },

      // --- Rotas de Técnicos (Apenas ADMIN) ---
      {
        path: "tecnicos",
        component: TecnicoListComponent,
        data: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "tecnicos/create",
        component: TecnicoCreateComponent,
        data: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "tecnicos/update/:id",
        component: TecnicoUpdateComponent,
        data: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "tecnicos/delete/:id",
        component: TecnicoDeleteComponent,
        data: { roles: ["ROLE_ADMIN"] },
      },

      // --- Rotas de Clientes (ADMIN e TÉCNICO) ---
      {
        path: "clientes",
        component: ClienteListComponent,
        data: { roles: ["ROLE_ADMIN", "ROLE_TECNICO"] },
      },
      {
        path: "clientes/create",
        component: ClienteCreateComponent,
        data: { roles: ["ROLE_ADMIN", "ROLE_TECNICO"] },
      },
      {
        path: "clientes/update/:id",
        component: ClienteUpdateComponent,
        data: { roles: ["ROLE_ADMIN", "ROLE_TECNICO"] },
      },
      {
        path: "clientes/delete/:id",
        component: ClienteDeleteComponent,
        data: { roles: ["ROLE_ADMIN", "ROLE_TECNICO"] },
      },

      // --- Rotas de Chamados (Acesso para TODOS os perfis logados) ---
      { path: "chamados", component: ChamadoListComponent },
      { path: "chamados/create", component: ChamadoCreateComponent },
      { path: "chamados/update/:id", component: ChamadoUpdateComponent },
      { path: "chamados/read/:id", component: ChamadoReadComponent },

      { path: "", redirectTo: "home", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
