import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoDocumentoModalComponent } from '../tipo-documento-modal/tipo-documento-modal.component';

@Component({
  selector: 'app-area-modal',
  templateUrl: './area-modal.component.html',
  styleUrls: ['./area-modal.component.css']
})
export class AreaModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TipoDocumentoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  
  onNoClick(){
    this.dialogRef.close();

  }
}
