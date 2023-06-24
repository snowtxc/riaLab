import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit{

  loading: boolean = true;
  userRoles : string[] = [];
  dataSource: { role: string } [] = [];
  userId : string = "";

  addRoleActive: boolean = false;
  displayedColumns: string[] = ["role","action"];

  formAddRole: FormGroup;
  submitAddRole : boolean = false;

  rolesList : string[] = [];
  @ViewChild('table', { static: true, read: MatTable }) table: any 

  

  @Output() addRoleEmit: EventEmitter<string> = new EventEmitter();
  @Output() removeRoleEmit: EventEmitter<string> = new EventEmitter();


  constructor(
    public dialogRef: MatDialogRef<UserRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userData: any},
    private _snackBar: MatSnackBar,
    private _auth: AuthService,
    private fb: FormBuilder
  ){
    this.formAddRole = this.fb.group({
        roleId : ["", Validators.required],
    })
    
  }

  ngOnInit(): void {
  
     this._auth.getRoles().subscribe(roles =>{
      const { userData } = this.data;
      const  userRoles = userData.roles;
      this.userId = userData.id;
      this.rolesList = roles;
      
     this.dataSource = userRoles.map((role:any) =>{
      return {
        role
      }
     })
     })

     

  }


  onNoClick($e:any){
    $e.preventDefault();
    this.dialogRef.close();
  }
  

  onRemoveRole(roleId:any){
    this._auth.removeRoleToUser(this.userId, roleId).subscribe(data =>{
      const { mensaje} = data;

      const index = this.dataSource.findIndex(item => item.role ==  roleId);
      this.dataSource.splice(index,1);
      this.table.renderRows();

      this._snackBar.open(mensaje, "Cerrar", {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
      this.removeRoleEmit.emit(roleId);


    });
  }

  onSubmit(){
    this.submitAddRole = true;
    if(this.formAddRole.invalid){
      return;
    }
    const { roleId } = this.formAddRole.value;
    this._auth.addRoleToUser(this.userId, roleId).subscribe((data)=>{
        const { mensaje } = data;
        this.dataSource.unshift({
          role: roleId
        })
        this.table.renderRows();
        this.submitAddRole = false;
        this.formAddRole.reset();
        this.addRoleEmit.emit(roleId);
        this.addRoleActive = false;
        this._snackBar.open(mensaje, "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
        
        
    }, (errorMsg) =>{
      this._snackBar.open(errorMsg, "Cerrar", {
        duration: 2000,
        panelClass: ['red-snackbar'],
      }); 
    });
  }
}
