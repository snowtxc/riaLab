import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { TipoIntegranteModalComponent } from 'src/app/components/tipo-integrante-modal/tipo-integrante-modal.component';
import { Role } from 'src/app/helpers/enums/roles.enum';
import { ITipoIntegrante } from 'src/app/interfaces/ITipoIntegrante';
import { PermissionsManagerService } from 'src/app/services/permissions.service';
import { TiposIntegrantesService } from 'src/app/services/tipos-integrantes.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-tipos-integrantes',
  templateUrl: './tipos-integrantes.component.html',
  styleUrls: ['./tipos-integrantes.component.css']
})
export class TiposIntegrantesComponent {
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo', 'actions'];
  dataSource: any[]=  [];
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

  disabledBtnEdit: boolean = false;
  disabledBtnDelete: boolean = false;


  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _tipoIntSrv:TiposIntegrantesService , private _snackBar: MatSnackBar,public dialog: MatDialog,private permissionSrv:PermissionsManagerService){
    this.disabledBtnDelete = !permissionSrv.isGranted([Role.ADMIN]); 
    this.disabledBtnEdit = !permissionSrv.isGranted([Role.ADMIN]);  

  }

  ngOnInit(): void {
    this._tipoIntSrv.list(this.paginationObj).subscribe(data =>{ 
      this.dataSource = data.list;
      this.totalCount = data.totalCount;
      this.loading = false;
    })
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getTiposIntegrantes();
  }

  getTiposIntegrantes(): void {
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
  
    this._tipoIntSrv.list(this.paginationObj).subscribe(
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
    this.getTiposIntegrantes();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getTiposIntegrantes();
  }

  onClickAdd():void{
    const tipoIntegrante: ITipoIntegrante = {
      id: 0,
      nombre: '',
      activo: false,
      orden: 0
    }
    const dialogRef = this.dialog.open(TipoIntegranteModalComponent,{data:{element:{...tipoIntegrante},id:0, action:"create"}});
    dialogRef.afterClosed().subscribe((modalData:any) => {
      if(modalData){
          this.getTiposIntegrantes()
      }
    });
  }

  onEdit(element:ITipoIntegrante):void{
    const dialogRef = this.dialog.open(TipoIntegranteModalComponent,{data:{ element: {...element},id:element.id, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getTiposIntegrantes()
      }
    });
  }

  onRemove(element:ITipoIntegrante):void{
    const title =  `Eliminar Tipo de Integrante`;
    const text  = `Seguro deseas eliminar este tipo de integrante ${element.nombre} ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._tipoIntSrv.delete(element.id).subscribe((data:any) =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource.splice(index,1);
          this._snackBar.open("Tipo de integrante eliminado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['success-snackbar'], 
          });
          this.getTiposIntegrantes();

        })
      }

    });
  }
}
