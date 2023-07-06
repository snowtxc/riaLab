import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'src/app/helpers/enums/action.enum';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})


export class UserModalComponent  {

  @ViewChild("fileInput") fileInput:any;
  @ViewChild("avatar") avatar:any;

  @Output()
  onSubmitEmit = new EventEmitter();


  imageB64:any = null;
  form: FormGroup;
  submit : boolean = false;
  userId : string = "";
    


  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb : FormBuilder,
    private _auth: AuthService
  ) {

    if(this.data.action ==  Action.EDIT){
      const { element, userId } = this.data;
      this.form = this.fb.group({
        tipoDocumentoId : [element.persona.tipoDeDocumento.id, Validators.required],
        documento: [element.persona.documento, Validators.required],
        primerNombre: [element.persona.primerNombre, Validators.required],
        segundoNombre: [element.persona.segundoNombre],
        primerApellido: [element.persona.primerApellido, Validators.required],
        segundoApellido: [element.persona.segundoApellido],
        email: [element.email, [Validators.required, Validators.email]],
        activo: [element.persona.activo]
      })
      this.userId = userId;
      this.imageB64 = element.imagen;
      
    }else{
      this.form = this.fb.group({
        tipoDocumentoId : [null, Validators.required],
        documento: [null, Validators.required],
        primerNombre: ['', Validators.required],
        segundoNombre: [''],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        email: ['', [Validators.required, Validators.email]],
        activo: [false]
      })
    }
    
  }


 
  onNoClick($e:any){
    $e.preventDefault();
    this.dialogRef.close();
  }

  fileClick($e:any){
    $e.preventDefault();
    this.fileInput.nativeElement.click();
  }

  selectFile($e?:any){
    $e.preventDefault();
    
    const file:File = $e.target.files[0];
    const fileName = file.name;
    const extension = fileName.split(".").pop();
    if(extension != 'jpg'&& extension != 'png' && extension != 'jpeg'){
      this._snackBar.open("El archivo debe ser una imagen", "Cerrar",{
        duration: 1000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.previewImage(file);
    
  }

  previewImage(file:File){
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imageB64 = reader.result;
    }
    reader.readAsDataURL(file);

    
  }

  onSubmit(){
     this.submit = true;
     if(this.form.invalid){
      return;
     }

     if(!this.imageB64){
      this._snackBar.open("Debes importar una imagen", "Try again!",{
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
     }  

    const body = {
        id: this.userId,
        ...this.form.value,
        imagen : this.imageB64
    }

    if(this.data.action ==  Action.EDIT){
        this._auth.updateUser(body).subscribe(result =>{
          this._snackBar.open("Usuario editado correctamente", "Cerrar", {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(body);
          this.submit = false;
        }, errorMsg =>{
          console.log(errorMsg)
          this._snackBar.open("Error", "Try again!",{
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        })
    }else{
      this._auth.createUser(body).subscribe((userCreated: IUser) => {
        this._snackBar.open("Usuario creado correctamente", "Cerrar", {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(userCreated);
  
      }, errorMsg =>{
        this._snackBar.open("error", "Try again!",{
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
      this.submit = false;
    }
   
  }


  changeActiveField(value:boolean){
    this.form.controls['activo'].setValue(value);
  }
  

}
