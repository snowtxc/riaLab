import { Component, OnInit, ViewChild } from '@angular/core';
import { ILlamadosEstadoPosibles } from 'src/app/interfaces/ILlamadosEstadoPosibles';
import { MatDialog } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table' //<--you need import MatTable
import {MatSnackBar} from '@angular/material/snack-bar';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { LlamadosEstadosPosiblesService } from 'src/app/services/llamados-estados-posibles.service';
import { LlamadoEstadoPosibleModalComponent } from 'src/app/components/llamado-estado-posible-modal/llamado-estado-posible-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PermissionsManagerService } from 'src/app/services/permissions.service';
import { Role } from 'src/app/helpers/enums/roles.enum';


@Component({
  selector: 'app-estados-llamados-posibles',
  templateUrl: './llamados-estados-posibles.component.html',
  styleUrls: ['./llamados-estados-posibles.component.css']
})

export class LlamadosEstadosPosibles implements OnInit{
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo', 'actions'];
  dataSource: ILlamadosEstadoPosibles[]=  [];
  pageEvent : PageEvent = {pageIndex:0, pageSize:10, length:0};
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';
  totalCount: number = 0;
  filterValue!:string;
  activoValue:null | boolean = null;

  
  private paginationObj = 
  {
    limit: this.pageEvent.pageSize,
    offset: this.pageEvent.pageIndex * this.pageEvent.pageSize,
    id: 0,
    filters: {
      activo: this.activoValue,
      nombre: "" 
    },
    orders: [
    ]
  }

  disabledBtnDelete : boolean = false;
  disabledBtnEdit: boolean = false;

  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _llamados:  LlamadosEstadosPosiblesService, private _snackBar: MatSnackBar,public dialog: MatDialog,private permissionSrv:PermissionsManagerService){
    this.disabledBtnDelete = !permissionSrv.isGranted([Role.ADMIN]); 
    this.disabledBtnEdit = !permissionSrv.isGranted([Role.ADMIN]);  
  }

  ngOnInit(): void {
    this.loading = false;
    this._llamados.list(this.paginationObj).subscribe(data =>{
      this.dataSource = data.list;
      this.totalCount = data.totalCount;
      this.loading = false;
    })
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getEstadosPosibles();
  }

  getEstadosPosibles(): void {
    const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    const pageSize = this.pageEvent ? this.pageEvent.pageSize : 10;
    const offset = pageIndex * pageSize;

    this.paginationObj = 
    {
      ...this.paginationObj,
      limit: pageSize,
      offset: offset,
      filters: {
        activo: this.activoValue,
        nombre:this.filterValue
      }
    }
  
    this._llamados.list(this.paginationObj).subscribe(
      response => {
        this.dataSource = response.list;
        this.totalCount = response.totalCount;
      },
      error => {
        console.log('Hubo un error al recuperar los tipos de estados posibles:', error);
      }
    );
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filterValue = valor;
    this.getEstadosPosibles();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getEstadosPosibles();
  }

  onClickAdd():void{
    const dialogRef = this.dialog.open(LlamadoEstadoPosibleModalComponent,{data:{element:{nombre:""}, action:"create"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          const body = {
            ...result, 
            activo: true
          }
          this._llamados.create(body).subscribe(data =>{
          this.dataSource.push(data)
          this.table.renderRows()
          this._snackBar.open("Tipo de documento creado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'],
    
          });
        })
      }
    });
  }

  onEdit(element:ILlamadosEstadoPosibles):void{
    const dialogRef = this.dialog.open(LlamadoEstadoPosibleModalComponent,{data:{ element: {id: element.id, nombre: element.nombre, activo: element.activo}, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._llamados.update(result).subscribe(data =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource[index] = data;
          this._snackBar.open("Tipo de documento editado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'], 
    
          });
          this.table.renderRows()

        }, error => {
          console.log(error)
        });
      }
    });
  }

  onRemove(element:ILlamadosEstadoPosibles):void{
    const title =  `Eliminar Tipo de documento`;
    const text  = `Seguro deseas eliminar el tipo de documento ${element.nombre} ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._llamados.delete(element.id).subscribe(data =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource.splice(index,1);
          this._snackBar.open("Tipo de documento eliminado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'], 
          });
          this.table.renderRows()

        }, error => {
          console.log(error)
        });
      }
    });
  }
}
