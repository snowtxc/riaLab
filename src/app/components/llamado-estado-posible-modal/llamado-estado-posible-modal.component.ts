import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-llamado-estado-posible-modal',
  templateUrl: './llamado-estado-posible-modal.component.html',
  styleUrls: ['./llamado-estado-posible-modal.component.css']
})
export class LlamadoEstadoPosibleModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LlamadoEstadoPosibleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  
  onNoClick(){
    this.dialogRef.close();

  }
}
