import { Injectable } from '@angular/core';
import { IPostulante } from '../interfaces/IPostulante';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {

  constructor(private _http:HttpClient) { }
  
  public create( newPostulante: IPostulante):Observable<any> {
    return this._http.post(environment.apiUrl+"/Postulantes", newPostulante);
  }

  public edit( postulanteId  : number, editPostulante: IPostulante):Observable<any> {
    return this._http.put(environment.apiUrl+"/Postulantes/"+postulanteId, editPostulante);
  }

  public remove(postulanteId:number){
    return this._http.delete(environment.apiUrl+"/Postulantes/"+postulanteId);

  }


}
