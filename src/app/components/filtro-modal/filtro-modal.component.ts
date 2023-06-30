import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';

@Component({
  selector: 'app-filtro-modal',
  templateUrl: './filtro-modal.component.html',
  styleUrls: ['./filtro-modal.component.css']
})
export class FiltroModalComponent {

  constructor(
    public dialogRef: MatDialogRef<FiltroModalComponent>,
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
