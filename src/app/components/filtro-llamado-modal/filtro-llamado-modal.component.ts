import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filtro-llamado-modal',
  templateUrl: './filtro-llamado-modal.component.html',
  styleUrls: ['./filtro-llamado-modal.component.css']
})
export class FiltroLlamadoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FiltroLlamadoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAccept() {
    this.dialogRef.close(this.data);
  }
}
