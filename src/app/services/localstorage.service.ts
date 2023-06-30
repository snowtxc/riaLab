import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private  keyToken = "token";
  private keyUser = "user";
  constructor() { }

  public getToken(){
    return localStorage.getItem(this.keyToken);
  }

  public setToken(token: string){
    localStorage.setItem(this.keyToken, token);
  }

  public removeToken(){
    localStorage.removeItem(this.keyToken);
  }

  public setUserData(userData: { email :string, nombre: string ,imagen: string, documento: string, idUsuario: string , roles: string[]}){
      localStorage.setItem(this.keyUser,  JSON.stringify(userData));
  }

  public getUserData(){
     const user = localStorage.getItem(this.keyUser);
     if(!user){
        return null;
     }
     const userData = JSON.parse(user);
     return userData;
  }

  public removeUserData(){
    localStorage.removeItem(this.keyUser);
  }
}
