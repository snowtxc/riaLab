import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';
import { IMiembroTribunal } from 'src/app/interfaces/IMiembroTribunal';
import { IPersona } from 'src/app/interfaces/IPersona';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { ITipoIntegrante } from 'src/app/interfaces/ITipoIntegrante';
import { MiembrotribunalService } from 'src/app/services/miembrotribunal.service';
import { PersonasService } from 'src/app/services/personas.service';

@Component({
  selector: 'app-miembro-tribunal-modal',
  templateUrl: './miembro-tribunal-modal.component.html',
  styleUrls: ['./miembro-tribunal-modal.component.css']
})
export class MiembroTribunalModalComponent {
   
  asignarPersonaExistente: boolean = false;
  submit: boolean = false;


  form: FormGroup;
  formSearch : FormGroup;

  personaSelected: IPersona | null = null;



  constructor(
    public dialogRef: MatDialogRef<MiembroTribunalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb : FormBuilder,
    private _personaSrv:PersonasService,
    private _miembroTribunalSrv: MiembrotribunalService
  ) { 
    
    if(this.data.action ==  Action.EDIT){
      this.form = this.fb.group({
        activo: [true],
        renuncia: [false, Validators.required],
        motivoRenuncia: [''], 
        tipoIntegranteId: [ false ],
        tipoDocumentoIdMiembro: [null, Validators.required],
        documentoMiembro: [null, Validators.required],
        primerNombreMiembro: [null, Validators.required],
        segundoNombreMiembro: [''],
        primerApellidoMiembro: [null, Validators.required],
        segundoApellidoMiembro: ['']
      })
      
    }else{
  
      this.form = this.fb.group({
        activo: [true],
        renuncia: [false, Validators.required],
        motivoRenuncia: [''], 
        tipoIntegranteId: [ false ],
        tipoDocumentoIdMiembro: [null, Validators.required],
        documentoMiembro: [null, Validators.required],
        primerNombreMiembro: [null, Validators.required],
        segundoNombreMiembro: [''],
        primerApellidoMiembro: [null, Validators.required],
        segundoApellidoMiembro: ['']
      })
      
    }

    this.formSearch =  this.fb.group({
      tipoDocumentoId: [null, Validators.required],
      documento: [null, Validators.required]
    });


    
  }

  onNoClick($e:any){
    $e.preventDefault();
    this.dialogRef.close();
  }

  searchPersona(){
      
    if(!this.formSearch.controls['tipoDocumentoId'].value || !this.formSearch.controls['documento'].value){
        return;
    }
    const tipoDocumentoId =  this.formSearch.controls['tipoDocumentoId'].value;
    const documento = this.formSearch.controls['documento'].value; 
    this._personaSrv.searchByDocumento(tipoDocumentoId,documento).subscribe((persona:any) =>{
       if(persona){
        this.personaSelected = persona;
        this.loadPersonInfo(persona);
       }else{
        this.personaSelected = null;
       }
    });
}


clearPersonaData(){
  this.form.controls['primerNombreMiembro'].setValue(null);
  this.form.controls['segundoNombreMiembro'].setValue('');
  this.form.controls['primerApellidoMiembro'].setValue(null);
  this.form.controls['segundoApellidoMiembro'].setValue('');
  this.form.controls['tipoDocumentoIdMiembro'].setValue(null);
  this.form.controls['documentoMiembro'].setValue(null);
}

loadPersonInfo(persona : IPersona){
     
  const { activo ,documento,  id, primerNombre, segundoNombre,primerApellido, segundoApellido, tipoDeDocumento} = persona;
  const tipoDocumentoId = tipoDeDocumento.id;

  this.form.controls['primerNombreMiembro'].setValue(primerNombre);
  this.form.controls['segundoNombreMiembro'].setValue(segundoNombre);
  this.form.controls['primerApellidoMiembro'].setValue(primerApellido);
  this.form.controls['segundoApellidoMiembro'].setValue(segundoApellido);
  this.form.controls['tipoDocumentoIdMiembro'].setValue(tipoDocumentoId);
  this.form.controls['documentoMiembro'].setValue(documento); 

}



changeAsignarPersonaExistente($event: any){
  this.asignarPersonaExistente = $event.checked;

  if(!this.asignarPersonaExistente){
      console.log('data')
      this.clearPersonaData();
  }
}


onSubmit(){
    this.submit = true;
     if(this.form.invalid){
      return;
     }
    
     const formValue = this.form.value;
    const { activo,  renuncia,
      motivoRenuncia,
      tipoDocumentoIdMiembro,
      tipoIntegranteId,
      documentoMiembro,
    primerNombreMiembro,
    segundoNombreMiembro,
    primerApellidoMiembro,
    segundoApellidoMiembro}  = formValue;  

    
    const tipoDocumentoSelected : ITipoDocumento = this.data.tiposDocumentos.find((tipoDoc:ITipoDocumento) => tipoDoc.id == tipoDocumentoIdMiembro);
    const tipoIntegrante : ITipoIntegrante = this.data.tiposDocumentos.find((tipoInt:ITipoIntegrante) => tipoInt.id == tipoIntegranteId);

    if(this.asignarPersonaExistente && this.personaSelected){

        const body: IMiembroTribunal=  {
          id: 0,
          orden: tipoIntegrante.orden,
          activo,
          renuncia,
          motivoRenuncia: renuncia ? motivoRenuncia : '',
          tipoDeIntegranteId: tipoIntegranteId,
          personaId: this.personaSelected.id,
          persona: this.personaSelected,
          llamadoId: this.data.llamadoId,
          tipoDeIntegrante: tipoIntegrante,
        
        }

        console.log(body);

        this._miembroTribunalSrv.create(body).subscribe(newMiembroTribunal =>{  
          console.log(newMiembroTribunal)
          this.dialogRef.close(newMiembroTribunal);
        })

        

    }else{
          this._personaSrv.create({
            id: 0,
            activo: true,
            documento: documentoMiembro,
            primerNombre: primerNombreMiembro,
            segundoNombre: segundoNombreMiembro,
            primerApellido: primerApellidoMiembro,
            segundoApellido: segundoApellidoMiembro,
            tipoDeDocumento: tipoDocumentoSelected,
            
          }).subscribe((newPersona:any) =>{
            const body: IMiembroTribunal=  {
              id: 0,
              orden: tipoIntegrante.orden,
              activo,
              renuncia,
              motivoRenuncia: renuncia ? motivoRenuncia : '',
              tipoDeIntegranteId: tipoIntegranteId,
              personaId: newPersona.id,
              persona: newPersona,
              llamadoId: this.data.llamadoId,
              tipoDeIntegrante: tipoIntegrante
            }

            this._miembroTribunalSrv.create(body).subscribe(newMiembroTribunal =>{  
              this.dialogRef.close(newMiembroTribunal);
            })

        
          })
          
      
    }


  
    
    this.submit = false;
}

  

    
  
}
