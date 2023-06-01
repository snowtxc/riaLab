import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private  key = "token";
  constructor() { }

  public getToken(){
    return localStorage.getItem(this.key);
  }

  public setToken(token: string){
    localStorage.setItem(this.key, token);
  }

  public removeToken(){
    localStorage.removeItem(this.key);
  }
}
