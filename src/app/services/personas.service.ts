import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private http :HttpClient) { }


  delete(id:string){
    return this.http.delete(environment.apiUrl+"/Personas/"+id);
  }
}
