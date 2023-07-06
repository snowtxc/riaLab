import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Role } from 'src/app/helpers/enums/roles.enum';
import { ILLamado } from 'src/app/interfaces/ILlamado';
import { LlamadosService } from 'src/app/services/llamados.service';

@Component({
  selector: 'app-llamados',
  templateUrl: './llamados.component.html',
  styleUrls: ['./llamados.component.css']
})
export class LlamadosComponent implements OnInit {
  loading: boolean = true;
  displayedColumns: string[] = ['identificador', 'nombre', 'linkPlanillaPuntajes', 'linkActa', 'minutosEntrevista', "actions"];
  dataSource: ILLamado[] = [];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';
  totalCount: number = 0;
  filterValue!: string;
  activoValue: null | boolean = null;

  roles: typeof Role = Role;

  paginationObj = {
    limit: this.pageEvent.pageSize,
    offset: this.pageEvent.pageIndex * this.pageEvent.pageSize,
    id: 0,
    filters: {
      activo: this.activoValue,
      nombre: "",
      identificador: "",
      personaTribunalId: 0,
      estadoId: 0

    },
    orders: [

    ]
  }

  disabledBtnDelete: boolean = false;
  disabledBtnEdit: boolean = false;

  constructor(private _llamados: LlamadosService, private router: Router) {

  }


  ngOnInit(): void {
    this.getLlamados();
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getLlamados();
  }

  getLlamados() {
    const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    const pageSize = this.pageEvent ? this.pageEvent.pageSize : 10;
    const offset = pageIndex * pageSize;

    this.paginationObj = 
    {
      ...this.paginationObj,
      limit: pageSize,
      offset: offset,
    }

    this.loading = true;
    this._llamados.list(this.paginationObj).subscribe((data: any) => {

      const { list, totalCount } = data;
      this.dataSource = list;
      this.totalCount = totalCount;
      this.loading = false;
    })

  }

  onClickAdd() {
    this.router.navigateByUrl("/llamados/nuevo");
  }


  onViewLlamado(element: ILLamado) {
    this.router.navigate(['/llamados', element.id, 'editar']);
  }

  handlePageEvent(e: PageEvent) {
    this.totalCount = e.pageSize;
    this.paginationObj.offset = e.pageIndex;

    this.getLlamados();
  }


}
