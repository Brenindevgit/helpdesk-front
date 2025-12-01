import { Component, OnInit } from "@angular/core";
import { ChamadoService } from "src/app/services/chamado.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  qtdAberto: number = 0;
  qtdAndamento: number = 0;
  qtdEncerrado: number = 0;

  constructor(private service: ChamadoService) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe((resposta) => {
      this.qtdAberto = 0;
      this.qtdAndamento = 0;
      this.qtdEncerrado = 0;

      resposta.forEach((element) => {
        if (element.status == "0") {
          this.qtdAberto++;
        } else if (element.status == "1") {
          this.qtdAndamento++;
        } else {
          this.qtdEncerrado++;
        }
      });
    });
  }
}
