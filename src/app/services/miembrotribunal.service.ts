import { Injectable } from '@angular/core';
import { IPostulante } from '../interfaces/IPostulante';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMiembroTribunal } from '../interfaces/IMiembroTribunal';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MiembrotribunalService {

  constructor(private _http:HttpClient) { }
  
  public create( newMiembroTribunal: IMiembroTribunal):Observable<any> {
    return this._http.post(environment.apiUrl+"/MiembrosTribunales", newMiembroTribunal);
  }
}
