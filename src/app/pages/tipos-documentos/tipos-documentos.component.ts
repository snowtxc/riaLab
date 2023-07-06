import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoDocumentoModalComponent } from 'src/app/components/tipo-documento-modal/tipo-documento-modal.component';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';
import { MatDialog } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table' //<--you need import MatTable
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Role } from 'src/app/helpers/enums/roles.enum';
import { PermissionsManagerService } from 'src/app/services/permissions.service';


@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.css']
})

export class TiposDocumentosComponent implements OnInit{
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo', 'actions'];
  dataSource: ITipoDocumento[]=  [];
  pageEvent : PageEvent = {pageIndex:0, pageSize:10, length:0};
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';
  totalCount: number = 0;
  filterValue!:string;
  activoValue:null | boolean = null;

  roles : typeof Role = Role;

   
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

  
  disabledBtnEdit : boolean = false;
  disabledBtnDelete : boolean = false;

  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _tiposDocSrv: TiposDocumentosService, private _snackBar: MatSnackBar,public dialog: MatDialog,private permissionSrv:PermissionsManagerService){
      this.disabledBtnDelete = !permissionSrv.isGranted([Role.ADMIN]);
      this.disabledBtnEdit = !permissionSrv.isGranted([Role.ADMIN]);  
  }

  ngOnInit(): void {
    this._tiposDocSrv.list(this.paginationObj).subscribe(data =>{
      this.dataSource = data.list;
      this.totalCount = data.totalCount;
      this.loading = false;
    })
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getTiposDeDocumento();
  }

  getTiposDeDocumento(): void {
    const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    const pageSize = this.pageEvent ? this.pageEvent.pageSize : 10;
    const offset = pageIndex * pageSize;

    this.paginationObj = 
    {
      ...this.paginationObj,
      limit: pageSize,
      offset: offset,
      filters: {
        activo:this.activoValue,
        nombre:this.filterValue
      }
    }
  
    this._tiposDocSrv.list(this.paginationObj).subscribe(
      response => {
        this.dataSource = response.list;
        this.totalCount = response.totalCount;
      },
      error => {
        console.log('Hubo un error al recuperar los tipos de documento:', error);
      }
    );
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filterValue = valor;
    this.getTiposDeDocumento();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getTiposDeDocumento();
  }

  onClickAdd():void{
    const tipoDocumento: ITipoDocumento = {
      id: 0,
      nombre: '',
      activo: false,
    }
    const dialogRef = this.dialog.open(TipoDocumentoModalComponent,{data:{element:{...tipoDocumento},id:0, action:"create"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.getTiposDeDocumento();
      }
    });
  }

  onEdit(element:ITipoDocumento):void{
    const dialogRef = this.dialog.open(TipoDocumentoModalComponent,{data:{ element: {...element},id:element.id, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTiposDeDocumento();
      }
    });
  }

  onRemove(element:ITipoDocumento):void{
    const title =  `Eliminar Tipo de documento`;
    const text  = `Seguro deseas eliminar el tipo de documento ${element.nombre} ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._tiposDocSrv.delete(element.id).subscribe(data =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource.splice(index,1);
          this._snackBar.open("Tipo de documento eliminado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['success-snackbar'], 
          });
          this.getTiposDeDocumento()


        }, error => {
          console.log(error)
        });
      }
    });
  }
}
