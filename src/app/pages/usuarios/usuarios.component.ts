import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { UserRolesComponent } from 'src/app/components/user-roles/user-roles.component';

import { IUserDTO } from 'src/app/helpers/dtos/IUserDto';
import { IResponseList } from 'src/app/interfaces/IResponse';
import { ITipoDocumento } from 'src/app/interfaces/ITipoDocumento';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { PersonasService } from 'src/app/services/personas.service';
import { TiposDocumentosService } from 'src/app/services/tipos-documentos.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  countTotal: number = 0;
  public tiposDocumentos: ITipoDocumento[] = [];
  pageEvent : PageEvent = {pageIndex:0, pageSize:10, length:0};
  filterValue!:string;
  activoValue:null | boolean = null;
  totalCount: number = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';

  public paginationObj =
    {
      limit: this.pageEvent.pageSize,
    offset: this.pageEvent.pageIndex * this.pageEvent.pageSize,
      id: 0,
      filters: {
        activo: this.activoValue,
        nombre: "",
        idUsuario: "",
        username: "",
        email: "",
        documento: ""
        
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

  getUsuarios(): void {
    const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    const pageSize = this.pageEvent ? this.pageEvent.pageSize : 10;
    const offset = pageIndex * pageSize;

    this.paginationObj = 
    {
      ...this.paginationObj,
      limit: pageSize,
      offset: offset,
      filters: {
        activo:this.activoValue,
        nombre:this.filterValue,
        idUsuario: "",
        username: "",
        email: "",
        documento: ""
      }
    }
  
    this._authSrv.listUsers(this.paginationObj).subscribe(
      response => {
        this.dataSource = response.list;
        this.totalCount = response.totalCount;
      },
      error => {
        console.log('Hubo un error al recuperar los tipos :', error);
      }
    );
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filterValue = valor;
    this.listUsers();
  }

  changeActivo(event: MatCheckboxChange) {
    const valor = event.checked;
    console.log(valor)
    if (valor) {
      this.activoValue = true;
    } else {
      this.activoValue = null;
    }
    this.getUsuarios()
  }

  listUsers() {
    this.loading = true;
    this._authSrv.listUsers(this.paginationObj).subscribe((data: IResponseList) => {
      console.log(this.paginationObj);
      console.log(data);
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
          activo: user.persona.activo,
          roles: user.roles
        }
      })

      console.log(data);
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
      this.tiposDocumentos = data.list;
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


  onViewRoles(element: IUser): void {
    const { id } = element;
    const dialogRef = this.dialog.open(UserRolesComponent, { data: { userData: element} });
    dialogRef.componentInstance.addRoleEmit.subscribe((roleId) =>{
        const indexUser = this.dataSource.findIndex(user => user.id == element.id);
        this.dataSource[indexUser].roles.unshift(roleId);
    })

    dialogRef.componentInstance.removeRoleEmit.subscribe((roleId) =>{
      const indexUser = this.dataSource.findIndex(user => user.id == element.id);
      const indexRole = this.dataSource[indexUser].roles.findIndex((role:any) => role == roleId);
      this.dataSource[indexUser].roles.splice(indexRole,1)
    })
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


}



  

