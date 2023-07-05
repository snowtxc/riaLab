import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Action } from 'src/app/helpers/enums/action.enum';
import { IPersona } from 'src/app/interfaces/IPersona';
import { IPostulante } from 'src/app/interfaces/IPostulante';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { PersonasService } from 'src/app/services/personas.service';
import { PostulanteService } from 'src/app/services/postulante.service';
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
    

  formSearch : FormGroup;

  asignarPersonaExistente: boolean =  false;

  personaSelected: IPersona | null = null;

  postulanteId : number | null = null;

  constructor(
    public dialogRef: MatDialogRef<PostulanteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb : FormBuilder,
    private _personaSrv:PersonasService,
    private _postulanteSrv:PostulanteService
  ) {
  

   
    if(this.data.action ==  Action.EDIT){
      const { fechaHoraEntrevista ,id} = this.data.element;

      this.postulanteId = id;
      
      const date = moment(fechaHoraEntrevista);
      
      const time = date.format("HH:mm A");
      const formattedDate = date.format("MM/DD/YYYY")

      this.personaSelected = this.data.element.persona;
      this.form = this.fb.group({
          activo: [this.data.element.activo],
          fechaEntrevista : [formattedDate, Validators.required],
          horaEntrevista: [time, Validators.required],
          estudioMeritosRealizado: [this.data.element.estudioMeritosRealizado], 
          entrevistaRealizada: [ this.data.element.entrevistaRealizada ],
          tipoDocumentoIdPostulante: [this.data.element.persona.tipoDeDocumento.id, Validators.required],
          documentoPostulante: [this.data.element.persona.documento, Validators.required],
          primerNombrePostulante: [this.data.element.persona.primerNombre, Validators.required],
          segundoNombrePostulante: [this.data.element.persona.segundoNombre],
          primerApellidoPostulante: [this.data.element.persona.primerApellido, Validators.required],
          segundoApellidoPostulante: [this.data.element.persona.segundoApellido]

          
        
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

    this.formSearch =  this.fb.group({
      tipoDocumentoId: [null, Validators.required],
      documento: [null, Validators.required]
    });
    

  
    
  }


 
  onNoClick($e:any){
    $e.preventDefault();
    this.dialogRef.close();
  }

  clearPostulanteData(){
      this.form.controls['primerNombrePostulante'].setValue(null);
      this.form.controls['segundoNombrePostulante'].setValue('');
      this.form.controls['primerApellidoPostulante'].setValue(null);
      this.form.controls['segundoApellidoPostulante'].setValue('');
      this.form.controls['tipoDocumentoIdPostulante'].setValue(null);
      this.form.controls['documentoPostulante'].setValue(null);
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


  loadPersonInfo(persona : IPersona){
     
     const { activo ,documento,  id, primerNombre, segundoNombre,primerApellido, segundoApellido, tipoDeDocumento} = persona;
     const tipoDocumentoId = tipoDeDocumento.id;

     this.form.controls['primerNombrePostulante'].setValue(primerNombre);
     this.form.controls['segundoNombrePostulante'].setValue(segundoNombre);
     this.form.controls['primerApellidoPostulante'].setValue(primerApellido);
     this.form.controls['segundoApellidoPostulante'].setValue(segundoApellido);
     this.form.controls['tipoDocumentoIdPostulante'].setValue(tipoDocumentoId);
     this.form.controls['documentoPostulante'].setValue(documento);
  }


  onSubmit(){
    
     this.submit = true;
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
   
    const fechaEntrevistaStr = moment(fechaEntrevista).format("DD-MM-YYYY") + " " + horaEntrevista;
    const fechaHoraEntrevista = moment(fechaEntrevistaStr, "DD-MM-YYYY h:mm A").toISOString(); 

    if(this.data.action == 'edit'){
        if(!this.postulanteId || !this.personaSelected){
          return;
        }

        const body:IPostulante  = {
          activo,
          fechaHoraEntrevista,
          estudioMeritosRealizado,
          entrevistaRealizada,
          persona: this.personaSelected,
          id: this.postulanteId,
          llamadoId: this.data.llamadoId,
          personaId: this.personaSelected.id
        }


        this._postulanteSrv.edit(this.postulanteId, body).subscribe(newPostulante =>{
          this.dialogRef.close(newPostulante);
        });
        
    }else{
      if(this.asignarPersonaExistente && this.personaSelected){
       
        const body: IPostulante=  {
          id: 0 , 
          activo,
          fechaHoraEntrevista,
          estudioMeritosRealizado,
          entrevistaRealizada,
          llamadoId: this.data.llamadoId,
          personaId: this.personaSelected.id,
          persona: this.personaSelected
        }
        this._postulanteSrv.create(body).subscribe(newPostulante =>{
          this.dialogRef.close(newPostulante);
        });
        
    }else{
          this._personaSrv.create({
            id: 0,
            activo: true,
            documento: documentoPostulante,
            primerNombre: primerNombrePostulante,
            segundoNombre: segundoNombrePostulante,
            primerApellido: primerApellidoPostulante,
            segundoApellido: segundoApellidoPostulante,
            tipoDeDocumento: tipoDocumentoSelected
          }).subscribe((newPersona:any) =>{
            const { id } = newPersona
            const body: IPostulante=  {
              id: 0 , 
              activo,
              fechaHoraEntrevista: fechaEntrevista,
              estudioMeritosRealizado,
              entrevistaRealizada,
              llamadoId: this.data.llamadoId,
              personaId: id,
              persona: newPersona
      
            }

            this._postulanteSrv.create(body).subscribe(newPostulante =>{
              this.dialogRef.close(newPostulante);
            })

        
          })
          
      
    }
  }
    
   


  
    
    this.submit = false;
    
  }


  changeActiveField(value:boolean){
    this.form.controls['activo'].setValue(value);
  }

  changeAsignarPersonaExistente($event: any){
    
    if(!this.asignarPersonaExistente){
        this.clearPostulanteData();
    }
    this.asignarPersonaExistente = $event.checked;
  }
  

}


