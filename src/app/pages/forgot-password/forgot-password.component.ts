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

  public loading = false;

  constructor(private _authSrv:AuthService,private _snackBar: MatSnackBar){}

  onRestablecerPass(){
      if(!this.email){
        return;
      }

      if(!this.validarEmail(this.email)){
          this._snackBar.open("Direccion de email invalida. por favor ingreser una correcta", "Cerrar",{
            duration: 2000,
            panelClass: ['red-snackbar'],
          });
          return;
         
      }
      this.loading = true;
      this._authSrv.forgotPassword(this.email).subscribe((data) =>{
        const email = this.email;
        this.email = "";
        this.loading = false;
        this._snackBar.open("Se ha enviado un email para restablecer la password a la direccion : " + email, "Cerrar",{
          duration: 2000,
          panelClass: ['red-snackbar'],
        });

      }, errorMsg =>{
        this.loading = false;

        this._snackBar.open(errorMsg, "Cerrar",{
          duration: 2000,
          panelClass: ['red-snackbar'],
        });

      })
      
  }

  validarEmail(email:string){
    const reg = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    return reg.test(email);
  }
}
