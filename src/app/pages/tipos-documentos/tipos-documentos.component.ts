import { Component, OnInit } from '@angular/core';
import { AddTipoDocumentoModalComponent } from 'src/app/components/add-tipo-documento-modal/add-tipo-documento-modal.component';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';

import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.css']
})

export class TiposDocumentosComponent implements OnInit{
  public loading = true;
  displayedColumns: string[] = ['nombre', 'activo'];
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

  private newTipoDoc : ITipoDocumento = {
    id: 0,
    nombre: '',
    activo: false
  }
  
 

  constructor(private _tiposDocSrv: TiposDocumentosService,public dialog: MatDialog){}

  ngOnInit(): void {
    this.loading = false;
    this._tiposDocSrv.list(this.paginationObj).subscribe(data =>{
      this.dataSource = data;
      this.loading = false;
    })
  }

  onClickAdd():void{
    const dialogRef = this.dialog.open(AddTipoDocumentoModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.newTipoDoc.nombre = result;
        this._tiposDocSrv.create(this.newTipoDoc).subscribe(data =>{
          console.log(data);
        })
      }
    });
  }

}
