import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Tecnico } from "src/app/models/tecnico";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-tecnico-list",
  templateUrl: "./tecnico-list.component.html",
  styleUrls: ["./tecnico-list.component.css"],
})
export class TecnicoListComponent implements OnInit {
  // Definição das colunas que vão aparecer na tabela
  displayedColumns: string[] = ["id", "nome", "cpf", "email", "acoes"];

  // Fonte de dados da tabela (começa vazia)
  dataSource = new MatTableDataSource<Tecnico>([]);

  // Referência ao paginador (para funcionar a paginação)
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: TecnicoService) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe((resposta) => {
      // Ao receber os dados do Java, jogamos na tabela
      this.dataSource = new MatTableDataSource<Tecnico>(resposta);
      this.dataSource.paginator = this.paginator;
    });
  }
}
