import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ILLamadoEstado } from '../interfaces/ILlamadoEstado';

@Injectable({
  providedIn: 'root'
})
export class LlamadosEstadosService {

  constructor(private _http:HttpClient) { }


  create(newLlamadoEstado:ILLamadoEstado):Observable<any>{
      return this._http.post(environment.apiUrl+"/LLamadosEstados",newLlamadoEstado);
  }
}
