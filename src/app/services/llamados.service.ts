import { Injectable } from '@angular/core';
import { ILLamado } from '../interfaces/ILlamado';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, map } from 'rxjs';

import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class LlamadosService {

  constructor(private _http:HttpClient) { }

  public list(paginationObj: { limit: number,
    offset: number,
    id: number,
    filters: {
      activo: boolean | null,
      nombre: string,
      identificador: string,
      personaTribunalId: number,
      estadoId: number
    },
    orders: string[

    ]}
    ) {

    
    return this._http.post(environment.apiUrl+"/Llamados/Paged",paginationObj).pipe(map((res:any) =>{
        const { list , totalCount} = res;
        return {list, totalCount};
    }));
  }


 


  public create(newLlamado:any){
      return this._http.post(environment.apiUrl+"/Llamados", newLlamado);
  }

  public update( editLlamado: ILLamado):Observable<any> {
    return this._http.put(environment.apiUrl+"/Llamados/" + editLlamado.id, editLlamado);
  }

  public delete( id:number ):Observable<any> {
    return this._http.delete(environment.apiUrl+"/Llamados/"+id);
  }
  
  public getById(id:string){
    console.log({
      limit: 1,
      offset: 0,
      id: 38,
      filters: { 
        activo: null,
        nombre: "", 
        identificador: "" 
      },
      orders: [
        
      ]
    })
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


