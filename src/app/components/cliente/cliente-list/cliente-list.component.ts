import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Cliente } from "src/app/models/cliente";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-cliente-list",
  templateUrl: "./cliente-list.component.html",
  styleUrls: ["./cliente-list.component.css"],
})
export class ClienteListComponent implements OnInit {
  // Colunas que serão exibidas na tabela
  displayedColumns: string[] = ["id", "nome", "cpf", "email", "acoes"];

  // Fonte de dados da tabela (inicialmente vazia)
  dataSource = new MatTableDataSource<Cliente>([]);

  // Paginador da tabela
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ClienteService) {}

  ngOnInit(): void {
    this.findAll();
  }

  // Método para buscar todos os clientes do backend
  findAll() {
    this.service.findAll().subscribe((resposta) => {
      // Atualiza a fonte de dados com a resposta do servidor
      this.dataSource = new MatTableDataSource<Cliente>(resposta);
      this.dataSource.paginator = this.paginator;
    });
  }
}
