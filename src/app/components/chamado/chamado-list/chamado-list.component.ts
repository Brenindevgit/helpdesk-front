import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Chamado } from "src/app/models/chamado";
import { ChamadoService } from "src/app/services/chamado.service";

@Component({
  selector: "app-chamado-list",
  templateUrl: "./chamado-list.component.html",
  styleUrls: ["./chamado-list.component.css"],
})
export class ChamadoListComponent implements OnInit {
  ELEMENT_DATA: Chamado[] = []; // Guarda a lista COMPLETA original
  FILTERED_DATA: Chamado[] = []; // (Opcional) Pode ajudar em logicas futuras

  displayedColumns: string[] = [
    "id",
    "titulo",
    "cliente",
    "tecnico",
    "dataAbertura",
    "prioridade",
    "status",
    "acoes",
  ];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ChamadoService) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe((resposta) => {
      this.ELEMENT_DATA = resposta; // Aqui temos todos os dados
      this.dataSource = new MatTableDataSource<Chamado>(resposta);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // --- MÉTODO NOVO: FILTRO POR STATUS ---
  orderByStatus(status: any): void {
    let list: Chamado[] = [];

    if (status == 3) {
      // 3 = TODOS (definido no HTML)
      list = this.ELEMENT_DATA;
    } else {
      // Filtra usando a lista original (ELEMENT_DATA)
      list = this.ELEMENT_DATA.filter((element) => element.status == status);
    }

    // Recria o DataSource com a lista filtrada
    this.dataSource = new MatTableDataSource<Chamado>(list);
    this.dataSource.paginator = this.paginator;
  }
  // --------------------------------------

  retornaStatus(status: any): string {
    if (status == "0") {
      return "ABERTO";
    } else if (status == "1") {
      return "EM ANDAMENTO";
    } else {
      return "ENCERRADO";
    }
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == "0") {
      return "BAIXA";
    } else if (prioridade == "1") {
      return "MÉDIA";
    } else {
      return "ALTA";
    }
  }
}
