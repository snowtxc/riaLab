import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ILlamadosEstadoPosibles } from '../interfaces/ILlamadosEstadoPosibles';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LlamadosEstadosPosiblesService {

  constructor(private _http : HttpClient) { }

    public list(paginationObj: { limit: number,
      offset: number,
      id: number,
      filters: {
        activo: boolean | null,
        nombre: string
      },
      orders: string[

      ]}
      ) {
  
      
      return this._http.post(environment.apiUrl+"/LlamadosEstadosPosibles/Paged",paginationObj).pipe(map((res:any) =>{
          const { list , totalCount} = res;
          return {list, totalCount};
      }));
    }

  
    public create( newLlamado: ILlamadosEstadoPosibles):Observable<any> {
      return this._http.post(environment.apiUrl+"/LlamadosEstadosPosibles", newLlamado);
    }
  
    public update( editLlamado: ILlamadosEstadoPosibles):Observable<any> {
      return this._http.put(environment.apiUrl+"/LlamadosEstadosPosibles/" + editLlamado.id, editLlamado);
    }
  
    public delete( id:number ):Observable<any> {
      console.log(id);
      return this._http.delete(environment.apiUrl+"/LlamadosEstadosPosibles/"+id);
    }

    public listAll(): Observable<any>{
      return this._http.post(environment.apiUrl+"/LlamadosEstadosPosibles/Paged",{
        limit: -1,
        offset: 0,
        filters: {
          activo: null,
          nombre: ""
        }
      }).pipe(map((res:any) =>{
        const { list } = res;
        return list;
    }));
    }
}


