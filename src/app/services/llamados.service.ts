import { Injectable } from '@angular/core';
import { ILLamado } from '../interfaces/ILlamado';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, map } from 'rxjs';

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

  public create(newLlamado:ILLamado){
      return this._http.post(environment.apiUrl+"/Llamados", newLlamado);
  }

  public update( editLlamado: ILLamado):Observable<any> {
    return this._http.put(environment.apiUrl+"/Llamados/" + editLlamado.id, editLlamado);
  }

  public delete( id:number ):Observable<any> {
    console.log(id);
    return this._http.delete(environment.apiUrl+"/Llamados/"+id);
  }
  
}


