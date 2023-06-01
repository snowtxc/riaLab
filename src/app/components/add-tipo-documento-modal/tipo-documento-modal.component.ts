import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'tipo-documento-modal',
  templateUrl: './tipo-documento-modal.component.html',

})
export class TipoDocumentoModalComponent {

    constructor(
      public dialogRef: MatDialogRef<TipoDocumentoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    
    onNoClick(){
      this.dialogRef.close();

    }
}
