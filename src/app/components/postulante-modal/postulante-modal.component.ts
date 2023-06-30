import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';
@Component({
  selector: 'app-postulante-modal',
  templateUrl: './postulante-modal.component.html',
  styleUrls: ['./postulante-modal.component.css']
})
export class PostulanteModalComponent {

  

  imageB64:any = null;
  form: FormGroup;
  submit : boolean = false;
  userId : string = "";
    


  constructor(
    public dialogRef: MatDialogRef<PostulanteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb : FormBuilder,
  ) {

    if(this.data.action ==  Action.EDIT){
      const { element, userId } = this.data;
      this.form = this.fb.group({
        tipoDocumentoId : [element.persona.tipoDeDocumento.id, Validators.required],
        documento: [element.persona.documento, Validators.required],
        primerNombre: [element.persona.primerNombre, Validators.required],
        segundoNombre: [element.persona.segundoNombre],
        primerApellido: [element.persona.primerApellido, Validators.required],
        segundoApellido: [element.persona.segundoApellido],
        email: [element.email, [Validators.required, Validators.email]],
        activo: [element.persona.activo]
      })
      this.userId = userId;
      this.imageB64 = element.imagen;
      
    }else{
      this.form = this.fb.group({
        tipoDocumentoId : [null, Validators.required],
        documento: [null, Validators.required],
        primerNombre: ['', Validators.required],
        segundoNombre: [''],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        email: ['', [Validators.required, Validators.email]],
        activo: [false]
      })
    }
    
  }


 
  onNoClick($e:any){
    $e.preventDefault();
    this.dialogRef.close();
  }
 


  onSubmit(){
    
     this.submit = true;
     alert("invalido")
     if(this.form.invalid){
      return;
     }
     alert("valido");
    if(this.data.action ==  Action.EDIT){
        
    }else{
      
      this.submit = false;
    }
   
  }


  changeActiveField(value:boolean){
    this.form.controls['activo'].setValue(value);
  }
  

}


