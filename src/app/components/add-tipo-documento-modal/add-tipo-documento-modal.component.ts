import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tipo-documento-modal',
  templateUrl: './add-tipo-documento-modal.component.html',
  styleUrls: ['./add-tipo-documento-modal.component.css']
})
export class AddTipoDocumentoModalComponent {
    public nombre: string = "";

    constructor(
      public dialogRef: MatDialogRef<AddTipoDocumentoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    
    onNoClick(){
      this.dialogRef.close();

    }
}
