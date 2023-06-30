import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

import { ConfirmedValidator } from 'src/app/helpers/validators/ConfirmedValidator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent  implements OnInit{
  public form : FormGroup;
  submit : boolean = false;

  private email?: string = "";
  private token?: string = "";

  constructor(private _authSrv:AuthService,private _snackBar: MatSnackBar, private fb:FormBuilder, private route: ActivatedRoute, private router:Router){
    this.form = this.fb.group({
      password: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    },
    {
      validator: ConfirmedValidator('password', 'confirmPassword')
    })
  } 

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.token = params['token']
      this.email = params['email']
    }
  );
  }

  onRestorePass(){
    this.submit = true;
    if(this.form.invalid){
      return;
    }
    if(!(this.email && this.token)){
      return;
    }
    const formValues =  this.form.value;
    this._authSrv.resetPassword(formValues.password, formValues.confirmPassword, this.email, this.token).subscribe(data =>{

      this.router.navigateByUrl("/login");
      this._snackBar.open("Contraseña cambiada exitosamente!", "Cerrar", {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
    }, 
    errorMsg =>{
      this._snackBar.open(errorMsg, "Cerrar", {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
    })
    

  }
}
