import { Injectable } from '@angular/core';
import { PermissionType } from '../helpers/enums/permissions.enum';
import { Role } from '../helpers/enums/roles.enum';
import { AuthService } from './auth.service';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsManagerService {

  constructor(private _localStorage: LocalstorageService) { }

  isGranted(usersRolesEnabled : Role[]) {
      const userData = this._localStorage.getUserData();
      console.log(userData)

      if(!userData){
         return false;
      }
      const { roles } = userData;
      
 
      return usersRolesEnabled.some(role => {
        return roles.includes(role);   
      })
  }

  
}
