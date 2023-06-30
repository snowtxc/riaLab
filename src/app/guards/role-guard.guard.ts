import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot } from "@angular/router";
import { PermissionsManagerService } from "../services/permissions.service";

import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {


  constructor(private  permissionSrv: PermissionsManagerService ,private router: Router) { }

  canActivate(
    route : ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      const rolesEnabled = route.data['roles'];
      const  isGranted =  this.permissionSrv.isGranted(rolesEnabled);
      if(!isGranted){
        this.router.navigateByUrl("/404");
      }
      return isGranted;
  }

}