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
import { PostulanteService } from 'src/app/services/postulante.service';
import { IMiembroTribunal } from 'src/app/interfaces/IMiembroTribunal';
import { MiembroTribunalModalComponent } from 'src/app/components/miembro-tribunal-modal/miembro-tribunal-modal.component';
import { TiposIntegrantesService } from 'src/app/services/tipos-integrantes.service';
import { ITipoIntegrante } from 'src/app/interfaces/ITipoIntegrante';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { LlamadosEstadosPosiblesService } from 'src/app/services/llamados-estados-posibles.service';
import { ILlamadosEstadoPosibles } from 'src/app/interfaces/ILlamadosEstadoPosibles';
import { LlamadosEstadosService } from 'src/app/services/llamados-estados.service';
import { ILLamadoEstado } from 'src/app/interfaces/ILlamadoEstado';
import { AuthService } from 'src/app/services/auth.service';
import { MiembrotribunalService } from 'src/app/services/miembrotribunal.service';




@Component({
  selector: 'app-nuevo-llamado',
  templateUrl: './nuevo-llamado.component.html',
  styleUrls: ['./nuevo-llamado.component.css']
})
export class NuevoLlamadoComponent implements OnInit{
    form: FormGroup;
    submit : boolean = false;

     Estados = {
      INICIADO : 1,
      PRONTO_ESTUDIO_MERITOS : 2,
      PRONTO_ENTREVISTA : 3,
      PRONTO_PSICOTECNICO : 4,
      PRONTO_FIRMAR_ACTA : 5,
      FINALIZADO : 6   
   }

    displayedColumnsPostulantes: string[] = ['primerNombre', 'primerApellido',  'fechaHoraEntrevista' ,  'estudiosMeritosRealizado', 'activo' , 'entrevistaRealizada' , "actions"];
    displayedColumnsMiembrosTribunales: string[] = ['orden', 'tipoDeIntegrante', 'primerNombre', 'primerApellido', 'documento' , "actions"];

    postulantesDataSource: IPostulante[] = []; 
    miembrosTribunalDataSource: IMiembroTribunal[] = []; 

    tiposDocumentos: ITipoDocumento[] = [];
    areas: IArea[] = [];

    action : string = '';
    loading: boolean = true;

    llamadoId?: number;

    tiposIntegrantes: ITipoIntegrante[] = [];

    llamadosEstadosPosibles: ILlamadosEstadoPosibles[] = [];

    currentEstado : ILLamadoEstado | null = null;

    
    @ViewChild('tablePostulantes', { static: true, read: MatTable }) tablePostulantes: any ; 
    @ViewChild('tableMiembrosTribunal', { static: true, read: MatTable }) tableMiembrosTribunal: any ; 


  constructor(private fb:FormBuilder, 
    private _tiposDocumento: TiposDocumentosService, 
    private _areaSrv:AreasService, public dialog: MatDialog,
    private route :ActivatedRoute, private _llamadoSrv:LlamadosService,
    private _snackBar: MatSnackBar ,
    private _postulanteSrv: PostulanteService,
    private _tiposIntegrantesSrv: TiposIntegrantesService,
    private _llamadosEstadoPosible: LlamadosEstadosPosiblesService,
    private _llamadoEstadoSrv: LlamadosEstadosService,
    private _authSrv:AuthService,
    private _miembroTribunalSrv:MiembrotribunalService){


    this.form = this.fb.group({
      activo  : [false, Validators.required],
      identificador: ['', Validators.required],
      nombre: ['', Validators.required],
      linkPlanillaPuntajes: ['', [Validators.required,Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      linkActa: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      minutosEntrevista: [null, [ Validators.required ,Validators.pattern('^[0-9]+$')]],
      areaId: [null, Validators.required],
    })

    
  }

  ngOnInit(): void {

      this._areaSrv.listAll().subscribe(data =>{
        this.areas = data;
      })
    const url = this.route.snapshot.url;
    const routeSegments = url.map(segment => segment.path);
   
    
    if (routeSegments.includes('editar')) {
        const llamadoId = this.route.snapshot.paramMap.get("id");
        if(!llamadoId){
          return;
        }
        this._llamadoSrv.getById(llamadoId).subscribe((data:any) =>{
            if(!data){
              return;  //redirect to not found
            }
            this.currentEstado =  data.ultimoEstado;


            const { id, activo , identificador, nombre , linkPlanillaPuntajes, linkActa, minutosEntrevista ,areaId , postulantes , miembrosTribunal} = data;
            this.postulantesDataSource = postulantes ? postulantes: [];
            this.miembrosTribunalDataSource = this.orderTableMiembros(miembrosTribunal) ? miembrosTribunal: [];
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
    this.getTiposIntegrantes();
    this.getLLamadosEstadosPosible();
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
    this._areaSrv.listAll().subscribe(data =>{
      this.areas = data;
    })
  }
  
  getTiposDocumentos(): void{
    this._tiposDocumento.list(
      {
        limit: -1,
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

  getTiposIntegrantes(): void{
    this._tiposIntegrantesSrv.listAll().subscribe(data =>{
      this.tiposIntegrantes = data;
    })

  }

  getLLamadosEstadosPosible(): void{
    this._llamadosEstadoPosible.listAll().subscribe(data =>{
      this.llamadosEstadosPosibles = data;
      
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
        
        this._snackBar.open("Informacion del llamada editada correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      });
    }else{
      this._llamadoSrv.create(body).subscribe((newLlamado:any) =>{
        const llamadoEstadoPosibleFind = this.llamadosEstadosPosibles.find((llamado) => llamado.id == 1);



        if(!this._authSrv.userValue){
          return;
        }


        if(!llamadoEstadoPosibleFind){
          return;
        }


        const userId = this._authSrv.userValue?.idUsuario;
        const llamadoId = newLlamado.id;


        const newEstadoBody:ILLamadoEstado = {
          id: 0,
          activo: true,
          fechaHora: new Date().toISOString(),
          usuarioTransicion:  userId ,
          observacion: '',
          llamadoId: llamadoId,
          llamadoEstadoPosibleId: llamadoEstadoPosibleFind.id,
          llamadoEstadoPosible: llamadoEstadoPosibleFind
        }

        this._llamadoEstadoSrv.create(newEstadoBody).subscribe(newEstado =>{
     
          this._snackBar.open("LLamado creado correctamente", "Cerrar", {
            duration: 2000,
            panelClass: ['red-snackbar'],
          }); 
        }, error =>{
          console.log(error)
        })

        
        this.form.reset();
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

  createLlamadoEstado(newEstadoId: number){
    const llamadoEstadoPosibleFind = this.llamadosEstadosPosibles.find((llamado) => llamado.id == newEstadoId);
    if(!this.llamadoId){
      return;
    }

    if(!llamadoEstadoPosibleFind){
      return;
    }

    const userId = this._authSrv.userValue?.idUsuario;
    const newEstadoBody:ILLamadoEstado = {
      id: 0,
      activo: true,
      fechaHora: new Date().toISOString(),
      usuarioTransicion:  userId ,
      observacion: '',
      llamadoId: this.llamadoId ,
      llamadoEstadoPosibleId: llamadoEstadoPosibleFind.id,
      llamadoEstadoPosible: llamadoEstadoPosibleFind
    }
    this._llamadoEstadoSrv.create(newEstadoBody).subscribe(newEstado =>{
      this.currentEstado = newEstado;
      console.log(this.currentEstado);
      this._snackBar.open("Ahora el estado del llamado se encuentra en " + newEstado.llamadoEstadoPosible.nombre , "Cerrar", {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
    })
  }

  nextEstado(){
    if(!this.currentEstado){
      return;
    }
    
    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title: "Deseas pasar al siguiente estado?", text : "Al confirmar el estado pasara al siguiente estado" }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        const estadoID =  this.currentEstado?.llamadoEstadoPosible.id;
        switch(estadoID){
            case this.Estados.INICIADO :
              if(this.postulantesDataSource.length <= 0){
                this._snackBar.open("Debes agregar al menos un postulante para iniciar el El Estudio de meritos", "Cerrar", {
                  duration: 2000,
                  panelClass: ['red-snackbar'],
                });
                return;
              }
              this.createLlamadoEstado(this.Estados.PRONTO_ESTUDIO_MERITOS);
              break;
            case this.Estados.PRONTO_ESTUDIO_MERITOS:
              const validEstudioMeritos = this.postulantesDataSource.every(postulante => postulante.estudioMeritosRealizado);
              if(!validEstudioMeritos){
                this._snackBar.open("Todos los postulantes deben haber realizado el estudio de meritos", "Cerrar", {
                  duration: 2000,
                  panelClass: ['red-snackbar'],
                }); 
                return;
              }
              this.createLlamadoEstado(this.Estados.PRONTO_ENTREVISTA);
              break;
            case this.Estados.PRONTO_ENTREVISTA:
              const validEntrevistas = this.postulantesDataSource.every(postulante => postulante.entrevistaRealizada);
              if(!validEntrevistas){
                this._snackBar.open("Todos los postulantes deben haber realizado la entrevista entrevista", "Cerrar", {
                  duration: 2000,
                  panelClass: ['red-snackbar'],
                });
                return;
              }
              this.createLlamadoEstado(this.Estados.PRONTO_PSICOTECNICO);
              break;
            case this.Estados.PRONTO_PSICOTECNICO:
              this.createLlamadoEstado(this.Estados.PRONTO_FIRMAR_ACTA);
              break;
            case this.Estados.PRONTO_FIRMAR_ACTA:
              this.createLlamadoEstado(this.Estados.FINALIZADO);
              break;
        }
      }
    });
 
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
    const dialogRef = this.dialog.open(PostulanteModalComponent, { data: { element:  {  ...defaultPostulante },  action: "create" , tiposDocumentos: this.tiposDocumentos , llamadoId: this.llamadoId } });
    dialogRef.afterClosed().subscribe((newPostulante: IPostulante) => {
        if(newPostulante){
            this.loading = true;
            this.postulantesDataSource.unshift(newPostulante);
            this.tablePostulantes.renderRows(); 
            
        }
    })


  

   

  }

  editPostulante(element:IPostulante){
    const dialogRef = this.dialog.open(PostulanteModalComponent, { data: { element:  {  ...element },  action: "edit" , tiposDocumentos: this.tiposDocumentos , llamadoId: this.llamadoId } });
    dialogRef.afterClosed().subscribe((editPostulante: IPostulante) => {
        if(editPostulante){
            this.loading = true;
            const index = this.postulantesDataSource.findIndex(item => item.id == editPostulante.id);
            this.postulantesDataSource[index] = editPostulante;
            this.tablePostulantes.renderRows();
            
        }
    })
  }

  removePostulante(element:IPostulante){
      const title  = `Deseas remover al postulante ${element.persona.primerNombre} ${element.persona.primerApellido} ?`;
      const text = ``;
      const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
      dialogRef.afterClosed().subscribe(confirm => {
        if(confirm){
          this._postulanteSrv.remove(element.id).subscribe((data:any) =>{
            const index = this.postulantesDataSource.findIndex(item => item.id ==  element.id);
            this.postulantesDataSource.splice(index,1);
            this._snackBar.open("Postulante removido correctamente", "Cerrar",{
              duration: 2000,
              panelClass: ['red-snackbar'], 
            });
            this.tablePostulantes.renderRows();

          })
        }

      });
  }
  



  openModalNewMiembroTribula(){
    const defaultMiembroTribunal: IMiembroTribunal = {
      id: 0,
      activo: false,
      orden: 0,
      renuncia: false,
      motivoRenuncia: '',
      llamadoId: 0,
      personaId: 0,
      persona: {
        id: 0,
        activo: null,
        tipoDeDocumento: {
          id: 0,
          activo: null,
          nombre: null
        },
        documento: null,
        primerNombre: null,
        segundoNombre: null,
        primerApellido: null,
        segundoApellido: null
      },
      tipoDeIntegranteId: 0,
      tipoDeIntegrante: {
        id: 0,
        activo: false,
        nombre: '',
        orden: 0
      }
    } 
    const dialogRef = this.dialog.open(MiembroTribunalModalComponent, { data: { element:  {  ...defaultMiembroTribunal },  action: "create" , tiposDocumentos: this.tiposDocumentos ,tiposIntegrantes: this.tiposIntegrantes,  llamadoId: this.llamadoId } });
    dialogRef.afterClosed().subscribe((newMiembroTribunal: IMiembroTribunal) => {
      if(newMiembroTribunal){
        this.loading = true;  

        const miembrosTribunal =  [...this.miembrosTribunalDataSource, ...[newMiembroTribunal]];
        this.miembrosTribunalDataSource = this.orderTableMiembros(miembrosTribunal);
        this.tableMiembrosTribunal.renderRows(); 
        
    }
    })
  }

  editTribunal(element:IMiembroTribunal){
    const dialogRef = this.dialog.open(MiembroTribunalModalComponent, { data: { element:  {  ...element},  action: "edit" , tiposDocumentos: this.tiposDocumentos ,tiposIntegrantes: this.tiposIntegrantes,  llamadoId: this.llamadoId } });
    dialogRef.afterClosed().subscribe((editedMiembro: IMiembroTribunal) => {
      if(editedMiembro){
          const index = this.miembrosTribunalDataSource.findIndex(miembro => miembro.id == editedMiembro.id);
          this.miembrosTribunalDataSource[index] = editedMiembro;
          this.tableMiembrosTribunal.renderRows();
          this._snackBar.open("Se actualizado la informacion del miembro del tribunal", "Cerrar", {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });

        
       }
    })
  
  }

  onRemove(element:IMiembroTribunal){
    const title =  `Remover miembro`;
    const text  = `Seguro deseas remover a  ${element.persona.primerNombre} ${element.persona.primerApellido} del tribunal ?`;

    const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this._miembroTribunalSrv.delete(element.id).subscribe((data:any) =>{

          const index = this.miembrosTribunalDataSource.findIndex(miembro => miembro.id == element.id);
          this.miembrosTribunalDataSource.splice(index,1);
          this.tableMiembrosTribunal.renderRows();
          this._snackBar.open("Miembro removido  correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['success-snackbar'], 
          });
          
        })
      }

    });
  }

  orderTableMiembros(dataSource:IMiembroTribunal[]){
    const orders = dataSource.sort((previous:IMiembroTribunal,current: IMiembroTribunal) =>{
      if(previous.tipoDeIntegrante.orden < current.tipoDeIntegrante.orden){
          return -1;
      }

      if(previous.tipoDeIntegrante.orden > current.tipoDeIntegrante.orden){
        return 1;
      }
      
      if(previous.orden < current.orden){
        return -1;
      }else{
        return 1;
      }
      
      
    })
    return orders;
  }
  
}
