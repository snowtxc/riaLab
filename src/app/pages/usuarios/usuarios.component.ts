import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { IUserDTO } from 'src/app/helpers/dtos/IUserDto';
import { IResponseList } from 'src/app/interfaces/IResponse';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  public defaultUserAvatarPath: string = "./assets/images/defaultUser.jpg";
  public loading = true;
  displayedColumns: string[] = ['imagen', 'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'email',"actions"];
  dataSource: any[]=  [];
  countTotal : number = 50;

  public paginationObj = 
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
  
  @ViewChild('table', { static: true,read:MatTable }) table:any

  constructor(private _authSrv:AuthService , private _snackBar: MatSnackBar,public dialog: MatDialog){}

  ngOnInit(): void {
    this.listUsers();
  }

  handlePageEvent(e: PageEvent) {
    this.countTotal = e.pageSize;
    this.paginationObj.offset = e.pageIndex;

    this.listUsers();
  }


  listUsers(){
    this._authSrv.listUsers(this.paginationObj).subscribe((data:IResponseList) =>{
      this.dataSource = data.list.map((user: IUser) =>{
        return {
          imagen: user.imagen,
          primerNombre: user.persona.primerNombre,
          segundoNombre: user.persona.segundoNombre ? user.persona.segundoNombre : '-',
          primerApellido: user.persona.primerApellido ? user.persona.primerApellido : '-',
          segundoApellido : user.persona.segundoApellido ? user.persona.segundoApellido : '-',
          email:  user.email
        }
      })
      this.paginationObj.limit = data.limit,
      this.paginationObj.offset = data.offset;
      this.countTotal = data.totalCount;

      this.loading = false;
    })
  }


  onClickAdd():void{
    const dialogRef = this.dialog.open(UserModalComponent,{data:{element:{nombre:""}, action:"create"}});
    dialogRef.afterClosed().subscribe((modalData:any) => {
      if(modalData){
          const body: IUserDTO = {
            id: '',
            tipoDocumentoId: 0,
            documento: '',
            primerNombre: '',
            segundoNombre: '',
            primerApellido: '',
            segundoApellido: '',
            email: '',
            imagen: '',
            activo: false
          }

          this._authSrv.createUser(body).subscribe((data:IUser) =>{
              this.dataSource.push(data)
              this.table.renderRows()
              this._snackBar.open("Usuario creado correctamente", "Cerrar",{
                duration: 2000,
                panelClass: ['red-snackbar'],
    
          });
        })
      }
    });
  }
  
  onEdit(element:IUser):void{
    const dialogRef = this.dialog.open(UserModalComponent,{data:{ element: {id: element.id, nombre: element.persona.primerNombre, activo: element.activo}, action:"edit"}});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._authSrv.updateUser(result).subscribe((data:IUser) =>{
          const index = this.dataSource.findIndex(item => item.id ==  data.id);
          this.dataSource[index] = data;
          this._snackBar.open("Usuario editado correctamente", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'], 
          });
          this.table.renderRows()

        })
      }
    });
  }



  

}
