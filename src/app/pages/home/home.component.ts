import { Component, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { FiltroLlamadoModalComponent } from 'src/app/components/filtro-llamado-modal/filtro-llamado-modal.component';
import { ILLamado } from 'src/app/interfaces/ILlamado';
import { ILLamadoEstado } from 'src/app/interfaces/ILlamadoEstado';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { LlamadosEstadosPosiblesService } from 'src/app/services/llamados-estados-posibles.service';
import { LlamadosService } from 'src/app/services/llamados.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo' ,'identificador','estado'];
  dataSource: ILLamado[]=  [];
  estadosArray: ILLamadoEstado[]=  [];
  pageEvent : PageEvent = {pageIndex:0, pageSize:10, length:0};
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';
  totalCount: number = 0;
  filterValue!:string;
  activoValue:null | boolean = null;
  username: string = ''


  private paginationObj = 
  {
    limit: this.pageEvent.pageSize,
    offset: this.pageEvent.pageIndex * this.pageEvent.pageSize,
    id: 0,
    filters: {
      activo: this.activoValue,
      nombre: "",
      identificador: "",
      personaTribunalId: 0,
      estadoId:0
    },
    orders: [
    ]
  }

  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _llamados:  LlamadosService,private _estados: LlamadosEstadosPosiblesService,private _authSrv:AuthService, private _snackBar: MatSnackBar,public dialog: MatDialog){}

  ngOnInit(): void {
    this.loading = false;
    this.getLlamados()
    this.username = this._authSrv.userValue.nombre
    console.log(this.username)
    // this._estados.listAll().subscribe(data =>{
    //   this.areasArray = data.list;
    //   console.log(this.areasArray)
    //   this.loading = false;
    // })
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getLlamados();
  }

  handlePageEvent(e: PageEvent) {
    this.totalCount = e.pageSize;
    this.paginationObj.offset = e.pageIndex;
    this.getLlamados();
  }

  getLlamados(): void {
    // const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    // const pageSize = this.pageEvent ? this.pageEvent.pageSize : 10;
    // const offset = pageIndex * pageSize;

    // this.paginationObj = 
    // {
    //   ...this.paginationObj,
    //   limit: pageSize,
    //   offset: offset,
    //   
    // }
    console.log(this._authSrv.userValue.personaId)
    
    this.paginationObj.filters.personaTribunalId = this._authSrv.userValue?.personaId;
    console.log(this.paginationObj)
    this._llamados.list(this.paginationObj).subscribe(
      response => {
        this.dataSource = response.list;
        this.totalCount = response.totalCount;
      },
      error => {
        console.log('Hubo un error al recuperar los llamados:', error);
      }
    );
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
   
    this.filterValue = valor;
    
    this.getLlamados();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getLlamados()
  }

  onClickFilters(): void {
    const dialogRef = this.dialog.open(FiltroLlamadoModalComponent, {data: this.paginationObj.filters});
    dialogRef.afterClosed().subscribe((filtros: any) => {
      if(filtros){
        this.paginationObj.filters = filtros;
        console.log(this.paginationObj.filters);
        this.getLlamados()
    }
    });
  }










}
