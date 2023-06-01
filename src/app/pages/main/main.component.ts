import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private _authSrv:AuthService, private router:Router){}

  onLogout():void{
      this._authSrv.logout();
      this.router.navigateByUrl("/login"); 
  }
}
