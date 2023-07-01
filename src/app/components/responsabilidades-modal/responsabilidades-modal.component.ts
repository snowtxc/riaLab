import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Action } from 'src/app/helpers/enums/action.enum';
import { ResponsabilidadesService } from 'src/app/services/responsabilidades.service';
import { IResponsabilidades } from 'src/app/interfaces/IResponsabilidades';
import { IArea } from 'src/app/interfaces/IArea';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-responsabilidades-modal',
  templateUrl: './responsabilidades-modal.component.html',
  styleUrls: ['./responsabilidades-modal.component.css']
})
export class ResponsabilidadesModalComponent {

  submit: boolean = false;
  form: FormGroup;
  resId: string = "";

  constructor(
    public dialogRef: MatDialogRef<ResponsabilidadesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _responsabilidadSrv: ResponsabilidadesService
  ) {
    const { element, id } = this.data;
    if (this.data.action == Action.EDIT) {
      this.form = this.fb.group({
        nombre: [element.nombre, Validators.required],
        descripcion: [element.descripcion, Validators.required],
        areaId: [element.areaId, Validators.required],
        activo: [element.activo]
      })
      this.resId = id;
    } else {
      this.form = this.fb.group({
        nombre: [element.nombre, Validators.required],
        descripcion: [element.descripcion, Validators.required],
        areaId: [element.areaId, Validators.required],
        activo: [element.activo]
      })
      this.resId = id;
    }
  }

  onNoClick() {
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

    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const area = this.data.areas.find((area: IArea) => area.id == this.form.controls["areaId"].value)
    const body = {
      ...this.form.value,
      id: this.resId,
      area,
      areaId: area.id,
    }
    console.log(body)
    if (this.data.action == Action.EDIT) {
      this.form.value.id = this.data.id
      this._responsabilidadSrv.update(body).subscribe(result => {
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
      this._responsabilidadSrv.create(body).subscribe((responsabilidadCreated: IResponsabilidades) => {
        this._snackBar.open("Responsabilidad creada correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
        this.dialogRef.close(responsabilidadCreated);
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
