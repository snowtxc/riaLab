import { Component,  OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IResponsabilidades } from 'src/app/interfaces/IResponsabilidades';
import {MatTable} from '@angular/material/table'
import { ResponsabilidadesService } from 'src/app/services/responsabilidades.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { ResponsabilidadesModalComponent } from 'src/app/components/responsabilidades-modal/responsabilidades-modal.component';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-responsabilidades',
  templateUrl: './responsabilidades.component.html',
  styleUrls: ['./responsabilidades.component.css']
})
export class ResponsabilidadesComponent {
  public loading = true;
  displayedColumns: string[] = ['nombre', 'descripcion' ,'activo', 'actions'];
  dataSource: IResponsabilidades[]=  [];
  areasArray: IResponsabilidades[]=  [];
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

  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _responsabilidades:  ResponsabilidadesService,private _areas: AreasService, private _snackBar: MatSnackBar,public dialog: MatDialog){}

  ngOnInit(): void {
    this.loading = false;
    this._responsabilidades.list(this.paginationObj).subscribe(data =>{
      this.dataSource = data.list;
      this.totalCount = data.totalCount;
      this.loading = false;
    })

    this._areas.listAll().subscribe(data =>{
      this.areasArray = data.list;
      console.log(this.areasArray)
      this.loading = false;
    })
  }

  onPaginateChange(event: PageEvent) {
    this.pageEvent = event;
    this.getResponsabilidades();
  }

  getResponsabilidades(): void {
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
  
    this._responsabilidades.list(this.paginationObj).subscribe(
      response => {
        this.dataSource = response.list;
        this.totalCount = response.totalCount;
      },
      error => {
        console.log('Hubo un error al recuperar las responsabilidades:', error);
      }
    );
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filterValue = valor;
    this.getResponsabilidades();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getResponsabilidades();
  }

  onClickAdd():void{
    const responsabilidadData: IResponsabilidades = {
      id: 0,
      nombre: '',
      descripcion: '',
      activo: false,
      area: {
        id: 0,
        activo: false,
        nombre: ''
      },
      areaId: ''
    }
    const dialogRef = this.dialog.open(ResponsabilidadesModalComponent,{data:{element:{...responsabilidadData},areas:this.areasArray,id:0, action:"create"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.getResponsabilidades();
      }
    });
  }

  onEdit(element:IResponsabilidades):void{
    const dialogRef = this.dialog.open(ResponsabilidadesModalComponent,{data:{ element: {...element},areas:this.areasArray,id:element.id, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getResponsabilidades();
    }
    });
  }

  onRemove(element:IResponsabilidades):void{
    const title =  `Eliminar Responsabilidad`;
    const text  = `Seguro deseas eliminar la responsabilidad ${element.nombre} ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._responsabilidades.delete(element.id).subscribe(data =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource.splice(index,1);
          this._snackBar.open("Responsabilidad eliminado correctamente", "Cerrar",{
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

