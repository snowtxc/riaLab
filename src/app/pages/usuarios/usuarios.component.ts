import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { IUserDTO } from 'src/app/helpers/dtos/IUserDto';
import { IResponseList } from 'src/app/interfaces/IResponse';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { PersonasService } from 'src/app/services/personas.service';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  public defaultUserAvatarPath: string = "./assets/images/defaultUser.jpg";
  public loading = true;
  displayedColumns: string[] = ['imagen', 'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'email', "actions"];
  dataSource: any[] = [];
  countTotal: number = 50;
  public tiposDocumentos: ITipoDocumento[] = [];

  public paginationObj =
    {
      limit: 10,
      offset: 0,
      id: 0,
      filters: {
        activo: undefined,
        nombre: ""
      },
      orders: [
      ]
    }

  @ViewChild('table', { static: true, read: MatTable }) table: any 

  constructor(private _authSrv: AuthService, 
    private _snackBar: MatSnackBar, 
    public dialog: MatDialog,
     private _tipoDocSrv: TiposDocumentosService,
     private _personaSrv: PersonasService) { }

  ngOnInit(): void {
    this.listUsers();
    this.listTiposDocumentos();
  }

  handlePageEvent(e: PageEvent) {
    this.countTotal = e.pageSize;
    this.paginationObj.offset = e.pageIndex;

    this.listUsers();
  }


  listUsers() {
    this.loading = true;
    this._authSrv.listUsers(this.paginationObj).subscribe((data: IResponseList) => {
      this.dataSource = data.list.map((user: IUser) => {
        return {
          id: user.id,
          imagen: user.imagen,
          primerNombre: user.persona.primerNombre,
          segundoNombre: user.persona.segundoNombre ? user.persona.segundoNombre : '-',
          primerApellido: user.persona.primerApellido ? user.persona.primerApellido : '-',
          segundoApellido: user.persona.segundoApellido ? user.persona.segundoApellido : '-',
          email: user.email,
          persona: user.persona,
          activo: user.persona.activo
        }
      })

      this.paginationObj.limit = data.limit,
      this.paginationObj.offset = data.offset;
      this.countTotal = data.totalCount;

      this.loading = false;
    })
  }

  listTiposDocumentos() {  //list all
    this._tipoDocSrv.list(
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
      this.tiposDocumentos = data;
    })
  }


  onClickAdd(): void {
    const dialogRef = this.dialog.open(UserModalComponent, { data: { element: null, tiposDocumentos: this.tiposDocumentos, action: "create" } });
    dialogRef.afterClosed().subscribe((userCreated: any) => {
      if (userCreated) {
         this.listUsers();
      }
    });
  }


  onEdit(element: IUser): void {
    const dialogRef = this.dialog.open(UserModalComponent, { data: { element: { ...element },tiposDocumentos: this.tiposDocumentos, action: "edit" , userId: element.id} });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
          const index = this.dataSource.findIndex(item => item.id == result.id);
          this.dataSource[index] = result; 
          this.table.renderRows();
          this._snackBar.open("Usuario editado correctamente", "Cerrar", {
            duration: 2000,
            panelClass: ['red-snackbar'],
          });
      }
    });
 
  }

onRemove(element : IUser){
  const title =  `Eliminar Usuario`;
  const text  = `Seguro deseas eliminar el usuario  con documento ${element.persona.documento}  ?`;

  const dialogRef = this.dialog.open(ConfirmModalComponent,{data:{ title, text }});
  dialogRef.afterClosed().subscribe(confirm => {
    if(confirm){
      this._personaSrv.delete(element.id).subscribe(data =>{
          console.log(data);

      }, error => {
        console.log(error)
      });
    }
  });
}
}



  

