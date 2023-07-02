import { Injectable } from '@angular/core';
import { ILLamado } from '../interfaces/ILlamado';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlamadosService {

  constructor(private _http:HttpClient) { }



  public list(paginationObj:{
    limit: number,
    offset: number,
    id: number,
    filters: {
      activo: number | null,
      nombre: string,
      identificador: string
    },
    orders: string[
      
    ]
  }){

    return this._http.post(environment.apiUrl+"/LLamados/Paged", paginationObj);
  }


  public create(newLlamado:any){
      return this._http.post(environment.apiUrl+"/Llamados", newLlamado);
  }

  public getById(id:string){
    return this._http.post(environment.apiUrl+"/Llamados/Paged", {
    limit: 1,
    offset: 0,
    id,
    filters: {
      activo: null,
      nombre: "", 
      identificador: "" 
    },
    orders: [
      
    ]
  }).pipe(map((data:any) =>{
    const { list } = data;
    if(list.length <= 0 ){
      return null;
    }
    return list[0];
  }));

  }

  public edit(id:number, editLlamado:any){
    return this._http.put(environment.apiUrl+"/Llamados/"+id, editLlamado);
  } 
  

  
}


