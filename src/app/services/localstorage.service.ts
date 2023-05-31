import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  public getToken(){
    return localStorage.getItem("token");
  }

  public setToken(token: string){
    localStorage.setItem("token", token);
  }
}
