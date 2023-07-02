import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PostulanteModalComponent } from 'src/app/components/postulante-modal/postulante-modal.component';
import { IArea } from 'src/app/interfaces/IArea';
import { IPostulante } from 'src/app/interfaces/IPostulante';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { AreasService } from 'src/app/services/areas.service';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';

import { Action } from 'src/app/helpers/enums/action.enum';
import { LlamadosService } from 'src/app/services/llamados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILLamado } from 'src/app/interfaces/ILlamado';
import { MatTable } from '@angular/material/table';
@Component({
  selector: 'app-nuevo-llamado',
  templateUrl: './nuevo-llamado.component.html',
  styleUrls: ['./nuevo-llamado.component.css']
})
export class NuevoLlamadoComponent implements OnInit{
    form: FormGroup;
    submit : boolean = false;

    displayedColumnsPostulantes: string[] = ['primerNombre', 'primerApellido',  'fechaHoraEntrevista' ,  'estudiosMeritosRealizado', 'activo' , 'entrevistaRealizada' , "actions"];
    displayedColumnsMiembrosTribunales: string[] = ['imagen', 'primerNombre', 'primerApellido', 'documento', 'email',  'fechaHoraEntrevista' , 'estudiosMeritosRealizado', 'activo' , 'entrevistaRealizada' , "actions"];

    postulantesDataSource: IPostulante[] = []; 
    miembrosTribunalDataSource: IPostulante[] = []; 

    tiposDocumentos: ITipoDocumento[] = [];
    areas: IArea[] = [];

    action : string = '';
    loading: boolean = true;

    llamadoId?: number;
    
    @ViewChild('table', { static: true, read: MatTable }) table: any 


  constructor(private fb:FormBuilder, private _tiposDocumento: TiposDocumentosService, private _areas:AreasService, public dialog: MatDialog,
    private route :ActivatedRoute, private _llamadoSrv:LlamadosService,
    private _snackBar: MatSnackBar ){
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
    const url = this.route.snapshot.url;
    const routeSegments = url.map(segment => segment.path);
   
    
    if (routeSegments.includes('editar')) {
        const llamadoId = this.route.snapshot.paramMap.get("id");
        if(!llamadoId){
          return;
        }
        this._llamadoSrv.getById(llamadoId).subscribe((data:ILLamado) =>{
            if(!data){
              return;  //redirect to not found
            }
            const { id, activo , identificador, nombre , linkPlanillaPuntajes, linkActa, minutosEntrevista ,areaId } = data;

            this.llamadoId = id;
            this.loadForm(activo,identificador, nombre, linkPlanillaPuntajes, linkActa, minutosEntrevista, areaId);
          
        }) 
        this.action = Action.EDIT;
    } else if (routeSegments.includes('crear')) {
        this.action = Action.CREATE;
        this.loading = false;
    }
    
    this.getAreas();
    this.getTiposDocumentos();
  }

 
  loadForm(activo:boolean, identificador: string, nombre:string , linkPlanillaPuntajes: string, linkActa: string, minutosEntrevista: number, areaId: number){
      this.form.controls['activo'].setValue(activo);
      this.form.controls['identificador'].setValue(identificador);
      this.form.controls['nombre'].setValue(nombre);
      this.form.controls['linkPlanillaPuntajes'].setValue(linkPlanillaPuntajes);
      this.form.controls['linkActa'].setValue(linkActa);
      this.form.controls['minutosEntrevista'].setValue(minutosEntrevista)
      this.form.controls['areaId'].setValue(areaId)
  }


  getAreas():void{
    this._areas.listAll().subscribe(data =>{
      this.areas = data;
    })
  }
  
  getTiposDocumentos(): void{
    this._tiposDocumento.list(
      {
        limit: 10,
        offset: 0,
        id: 0,
        filters: {
          activo: true,
          nombre: ""
        },
        orders: [
        ]
      }
    ).subscribe(data => {
      this.tiposDocumentos = data.list;
    })
  }

  onSubmit(){
    this.submit = true;
    if(this.form.invalid){
      return;
    }
    const formValues = this.form.value;
    const { activo , identificador, nombre, linkPlanillaPuntajes, linkActa, minutosEntrevista, areaId } = formValues;
    const body = {
      id: (this.action == Action.EDIT && this.llamadoId) ? this.llamadoId : 0,
      activo,
      identificador,
      nombre,
      linkPlanillaPuntajes,
      linkActa,
      minutosEntrevista,
      areaId ,
      postulantes: this.postulantesDataSource 
    }

    if(this.action == Action.EDIT && this.llamadoId){
      this._llamadoSrv.edit(this.llamadoId, body).subscribe((data) =>{
        console.log(data);
        this._snackBar.open("Informacion del llamada editada correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      });
    }else{
      this._llamadoSrv.create(body).subscribe(data =>{
        this._snackBar.open("LLamado creado correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
        this.form.reset();
        this.form.clearValidators();
        this.submit = false;
      }, errorMsg =>{
        this._snackBar.open(errorMsg, "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
        this.submit = false;
  
      })
    }
 
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
    const dialogRef = this.dialog.open(PostulanteModalComponent, { data: { element:  {  ...defaultPostulante },  action: "create" , tiposDocumentos: this.tiposDocumentos } });
    dialogRef.afterClosed().subscribe((newPostulante: IPostulante) => {
        if(newPostulante){
          console.log(newPostulante)
            this.postulantesDataSource.unshift(newPostulante);
            this.table.renderRows(); 
            
            
        }
    });


   

  }

  

}
