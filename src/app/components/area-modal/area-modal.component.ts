import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoDocumentoModalComponent } from '../tipo-documento-modal/tipo-documento-modal.component';
import { AreasService } from 'src/app/services/areas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IArea } from 'src/app/interfaces/IArea';

@Component({
  selector: 'app-area-modal',
  templateUrl: './area-modal.component.html',
  styleUrls: ['./area-modal.component.css']
})
export class AreaModalComponent {

  submit: boolean = false;
  form: FormGroup;
  resId: string = "";

  constructor(
    public dialogRef: MatDialogRef<AreaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _areas: AreasService 
  ) {

    const { element, id } = this.data;
    if (this.data.action == Action.EDIT) {
      this.form = this.fb.group({
        nombre: [element.nombre, Validators.required],
        activo: [element.activo]
      })
      this.resId = id;
    } else {
      this.form = this.fb.group({
        nombre: [element.nombre, Validators.required],
        activo: [element.activo]
      })
      this.resId = id;
    }
  }

  onNoClick(){
    this.dialogRef.close();
    
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.form.value.activo = true;
    } else {
      this.form.value.activo = false;
    }
  }

  onSubmit() {
    console.log("lelele")
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const body = {
      ...this.form.value,
      id: this.resId,
    }
    console.log(body)
    if (this.data.action == Action.EDIT) {
      this.form.value.id = this.data.id
      this._areas.update(body).subscribe(result => {
        this.dialogRef.close(body);
        this.submit = false;
      }, errorMsg => {
        console.log(errorMsg)
        this._snackBar.open(errorMsg, "Try again!", {
          duration: 5000,
          panelClass: ['red-snackbar'],
        });
      })
    } else {
      this._areas.create(body).subscribe((areaCreated: IArea) => {
        this._snackBar.open("area creada correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
        this.dialogRef.close(areaCreated);
      }, errorMsg => {
        this._snackBar.open(errorMsg, "Try again!", {
          duration: 5000,
          panelClass: ['red-snackbar'],
        });
      });
      this.submit = false;
    }
  }
}
