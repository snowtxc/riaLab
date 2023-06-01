import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoDocumentoModalComponent } from 'src/app/components/tipo-documento-modal/tipo-documento-modal.component';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';

import { MatDialog } from '@angular/material/dialog';

import {MatTable} from '@angular/material/table' //<--you need import MatTable
import {MatSnackBar} from '@angular/material/snack-bar';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';


@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.css']
})

export class TiposDocumentosComponent implements OnInit{
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo', 'actions'];
  dataSource: ITipoDocumento[]=  [];
  
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

  constructor(private _tiposDocSrv: TiposDocumentosService, private _snackBar: MatSnackBar,public dialog: MatDialog){}

  ngOnInit(): void {
    this._tiposDocSrv.list(this.paginationObj).subscribe(data =>{
      this.dataSource = data;
      this.loading = false;
    })
  }

  onClickAdd():void{
    const dialogRef = this.dialog.open(TipoDocumentoModalComponent,{data:{element:{nombre:""}, action:"create"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this._tiposDocSrv.create(result).subscribe(data =>{
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

  onEdit(element:ITipoDocumento):void{
    const dialogRef = this.dialog.open(TipoDocumentoModalComponent,{data:{ element: {id: element.id, nombre: element.nombre, activo: element.activo}, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._tiposDocSrv.update(result).subscribe(data =>{
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
