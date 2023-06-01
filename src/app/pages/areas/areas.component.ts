import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { AreaModalComponent } from 'src/app/components/area-modal/area-modal.component';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { IArea } from 'src/app/interfaces/IArea';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent {
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo', 'actions'];
  dataSource: any[]=  [];

  private paginationObj = 
  {
    limit: 10,
    offset: 0,
    id: 0,
    filters: {
      activo: true,
      nombre: ""
    },
    orders: [
    ]
  }
  
  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _areaSrv:AreasService , private _snackBar: MatSnackBar,public dialog: MatDialog){}

  ngOnInit(): void {
    this._areaSrv.list(this.paginationObj).subscribe((data:IArea[]) =>{
      this.dataSource = data;
      this.loading = false;
    })
  }

  onClickAdd():void{
    const dialogRef = this.dialog.open(AreaModalComponent,{data:{element:{nombre:""}, action:"create"}});
    dialogRef.afterClosed().subscribe(modalData => {
      if(modalData){
          const body:IArea = {
            id: 0,
            ...modalData,
            activo: true
          }
          console.log(body);

          this._areaSrv.create(body).subscribe((data:IArea) =>{
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

  onEdit(element:IArea):void{
    const dialogRef = this.dialog.open(AreaModalComponent,{data:{ element: {id: element.id, nombre: element.nombre, activo: element.activo}, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._areaSrv.update(result).subscribe((data:IArea) =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource[index] = data;
          this._snackBar.open("Tipo de documento editado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'], 
    
          });
          this.table.renderRows()

        })
      }
    });
  }

  onRemove(element:IArea):void{
    const title =  `Eliminar Área`;
    const text  = `Seguro deseas eliminar esta Área? ${element.nombre} ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._areaSrv.delete(element.id).subscribe((data:any) =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource.splice(index,1);
          this._snackBar.open("Área eliminada correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'], 
          });
          this.table.renderRows();

        })
      }

    });
  }
}
