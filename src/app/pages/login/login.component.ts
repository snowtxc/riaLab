import { Component } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';

//services
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm : FormGroup;
  submit : boolean = false;

  constructor(private fb:FormBuilder , private _authSrv:AuthService,private _snackBar: MatSnackBar, private router:Router){
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  onSubmitLogin(){
    this.submit = true;
    if(this.loginForm.invalid){
      return;
    }
    
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    this._authSrv.login(username,password).subscribe(data =>{
        this.router.navigateByUrl("/");
    }, error =>{
      this._snackBar.open(error, "Try again!",{
        duration: 2000,
        panelClass: ['red-snackbar'],

      });
    });

  }


}
