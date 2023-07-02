import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';
import { IPostulante } from 'src/app/interfaces/IPostulante';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
@Component({
  selector: 'app-postulante-modal',
  templateUrl: './postulante-modal.component.html',
  styleUrls: ['./postulante-modal.component.css']
})
export class PostulanteModalComponent {

  

  imageB64:any = null;
  form: FormGroup;
  submit : boolean = false;
  personaID : number = 0;

  dateMaxDate = new Date(2000, 0, 1);
  dateMinDate = new Date(2050,0,1);
    

  


  constructor(
    public dialogRef: MatDialogRef<PostulanteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb : FormBuilder,
  ) {
  

   
    if(this.data.action ==  Action.EDIT){
      this.form = this.fb.group({
        activo: [true],
        fechaEntrevista : [null, Validators.required],
        horaEntrevista: [null, Validators.required],
        estudioMeritosRealizado: [false], 
        entrevistaRealizada: [ false ],
        tipoDocumentoIdPostulante: [null, Validators.required],
        documentoPostulante: [null, Validators.required],
        primerNombrePostulante: [null, Validators.required],
        segundoNombrePostulante: [''],
        primerApellidoPostulante: [null, Validators.required],
        segundoApellidoPostulante: ['' ]

        
      
      })
    }else{
  
      this.form = this.fb.group({
        activo: [true],
        fechaEntrevista : [null, Validators.required],
        horaEntrevista: [null, Validators.required],
        estudioMeritosRealizado: [false], 
        entrevistaRealizada: [ false ],
        tipoDocumentoIdPostulante: [null, Validators.required],
        documentoPostulante: [null, Validators.required],
        primerNombrePostulante: [null, Validators.required],
        segundoNombrePostulante: [''],
        primerApellidoPostulante: [null, Validators.required],
        segundoApellidoPostulante: ['']
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
    
    const formValue = this.form.value;
    const { activo, fechaEntrevista , horaEntrevista,  estudioMeritosRealizado,  entrevistaRealizada , tipoDocumentoIdPostulante
      ,documentoPostulante,
    primerNombrePostulante,
    segundoNombrePostulante,
    primerApellidoPostulante,
    segundoApellidoPostulante}  = formValue;

    
    const tipoDocumentoSelected : ITipoDocumento = this.data.tiposDocumentos.find((tipoDoc:ITipoDocumento) => tipoDoc.id == tipoDocumentoIdPostulante);
   
    const body: IPostulante=  {
      id: 0 , 
      activo,
      fechaHoraEntrevista: fechaEntrevista,
      estudioMeritosRealizado,
      entrevistaRealizada,
      llamadoId: 0,
      personaId: this.personaID,
      persona: {
        id: 0,
        activo: true,
        documento: documentoPostulante,
        primerNombre: primerNombrePostulante,
        segundoNombre: segundoNombrePostulante,
        primerApellido: primerApellidoPostulante,
        segundoApellido: segundoApellidoPostulante,
        tipoDeDocumento: tipoDocumentoSelected
      }
    }
    
    this.dialogRef.close(body);
    this.submit = false;
    
   
  }


  changeActiveField(value:boolean){
    this.form.controls['activo'].setValue(value);
  }
  

}


