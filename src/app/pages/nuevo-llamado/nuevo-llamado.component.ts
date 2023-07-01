import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostulanteModalComponent } from 'src/app/components/postulante-modal/postulante-modal.component';
import { IArea } from 'src/app/interfaces/IArea';
import { IPostulante } from 'src/app/interfaces/IPostulante';
import { AreasService } from 'src/app/services/areas.service';


@Component({
  selector: 'app-nuevo-llamado',
  templateUrl: './nuevo-llamado.component.html',
  styleUrls: ['./nuevo-llamado.component.css']
})
export class NuevoLlamadoComponent implements OnInit{
  form: FormGroup;
  areas: IArea[] = [];
  submit : boolean = false;


 



 displayedColumnsPostulantes: string[] = ['imagen', 'primerNombre', 'primerApellido', 'documento', 'email',  'fechaHoraEntrevista' , 'estudiosMeritosRealizado', 'activo' , 'entrevistaRealizada' , "actions"];
 displayedColumnsMiembrosTribunales: string[] = ['imagen', 'primerNombre', 'primerApellido', 'documento', 'email',  'fechaHoraEntrevista' , 'estudiosMeritosRealizado', 'activo' , 'entrevistaRealizada' , "actions"];


 postulantesDataSource: IPostulante[] = []; 
 miembrosTribunalDataSource: IPostulante[] = []; 

  


  constructor(private fb:FormBuilder, private _areaSrv:AreasService, public dialog: MatDialog){
    this.form = this.fb.group({
      activo  : [false, Validators.required],
      identificador: ['', Validators.required],
      nombre: ['', Validators.required],
      linkPlanillaPuntajes: ['', [Validators.required,Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      linkActa: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      minutosEntrevista: [null, [ Validators.required , Validators.pattern('^-?(0|[1-9]\d*)?$')]],
      areaId: [null, Validators.required],

    })

    
  }

  ngOnInit(): void {
      // this._areaSrv.listAll().subscribe(data =>{
      //   console.log(data)
      //   this.areas = data;
      // })
  }

  onSubmit(){
    this.submit = true;
    if(this.form.invalid){
      alert("Formulario invalido");
      return;
    }
    alert("Formulario valido!!");
  }

  openModalNewPostulante(){
      const defaultPostulante: IPostulante = {
        id: 0,
        activo:  null,
        fechaHoraEntrevista: null,
        estudioMeritosRealizado:  null,
        entrevistaRealizada:  null,
        llamadoId:  null,
        personaId:  null,
        persona:  {
          id: 0,
          activo:  null,
          tipoDeDocumento: {
            id: 0,
            activo:  null,
            nombre:  null,
          },
          documento:  null,
          primerNombre: null,
          segundoNombre:  null,
          primerApellido:  null,
          segundoApellido:  null
        }
      }
    const dialogRef = this.dialog.open(PostulanteModalComponent, { data: { element:  {  ...defaultPostulante },  action: "create" } });
    dialogRef.afterClosed().subscribe((userCreated: any) => {
      
    });

  }

}
