import { Injectable } from '@angular/core';
import { ILLamado } from '../interfaces/ILlamado';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LlamadosService {

  constructor(private _http:HttpClient) { }


  public create(newLlamado:ILLamado){
      return this._http.post(environment.apiUrl+"/Llamados", newLlamado);
  }
  
}


