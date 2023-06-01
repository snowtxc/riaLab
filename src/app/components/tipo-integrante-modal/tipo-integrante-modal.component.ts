import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tipo-integrante-modal',
  templateUrl: './tipo-integrante-modal.component.html',
  styleUrls: ['./tipo-integrante-modal.component.css']
})
export class TipoIntegranteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TipoIntegranteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  
  onNoClick(){
    this.dialogRef.close();
  }
}
