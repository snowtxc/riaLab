import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IPersona } from '../interfaces/IPersona';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private http :HttpClient) { }


  delete(id:string){
    return this.http.delete(environment.apiUrl+"/Personas/"+id);
  }


  searchByDocumento(tipoDocumentoId: number , documento: string){
    return this.http.get(environment.apiUrl+"/Personas/"+tipoDocumentoId+"/"+documento);
  }

  create(persona:IPersona){
    return this.http.post(environment.apiUrl+"/Personas", persona);

  }
}
