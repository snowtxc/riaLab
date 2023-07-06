import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LlamadosEstadosPosiblesService } from 'src/app/services/llamados-estados-posibles.service';
import { Action } from 'src/app/helpers/enums/action.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ILlamadosEstadoPosibles } from 'src/app/interfaces/ILlamadosEstadoPosibles';

@Component({
  selector: 'app-llamado-estado-posible-modal',
  templateUrl: './llamado-estado-posible-modal.component.html',
  styleUrls: ['./llamado-estado-posible-modal.component.css']
})
export class LlamadoEstadoPosibleModalComponent {

  submit: boolean = false;
  form: FormGroup;
  resId: string = "";

  constructor(
    public dialogRef: MatDialogRef<LlamadoEstadoPosibleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _llamado: LlamadosEstadosPosiblesService
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
      this._llamado.update(body).subscribe(result => {
        this._snackBar.open("Tipo documento editado correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(body);
        this.submit = false;
      }, errorMsg => {
        console.log(errorMsg)
        this._snackBar.open("Error", "Try again!", {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      })
    } else {
      this._llamado.create(body).subscribe((llamadoCreated: ILlamadosEstadoPosibles) => {
        this._snackBar.open("Tipo documento creado correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(llamadoCreated);
      }, errorMsg => {
        this._snackBar.open(errorMsg, "Try again!", {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
      this.submit = false;
    }
  }
}
