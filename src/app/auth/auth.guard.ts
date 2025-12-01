import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1. Verifica se está autenticado
    if (this.authService.isAuthenticated()) {
      // 2. Verifica se a rota exige perfis específicos (definidos no app-routing)
      const requiredRoles = route.data["roles"] as Array<string>;

      // Se a rota não exigir perfis específicos, deixa passar
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // 3. Verifica se o usuário tem algum dos perfis exigidos
      let hasPermission = false;
      for (const role of requiredRoles) {
        if (this.authService.hasPermission(role)) {
          hasPermission = true;
          break;
        }
      }

      if (hasPermission) {
        return true;
      } else {
        // Logado, mas sem permissão
        this.toast.error("Acesso Negado!", "Segurança");
        this.router.navigate(["home"]);
        return false;
      }
    }

    // Não autenticado
    this.router.navigate(["login"]);
    return false;
  }
}
