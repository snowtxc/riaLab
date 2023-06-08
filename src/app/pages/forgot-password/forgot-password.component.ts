import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  public email: string  = '';

  constructor(private _authSrv:AuthService,private _snackBar: MatSnackBar){}

  onRestablecerPass(){
      if(!this.email){
        return;
      }

      this._authSrv.forgotPassword(this.email).subscribe((data) =>{
        console.log(data);
      }, errorMsg =>{
        this._snackBar.open(errorMsg, "Cerrar",{
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      })
      
  }
}
