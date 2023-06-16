import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ITipoIntegrante } from '../interfaces/ITipoIntegrante';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TiposIntegrantesService {

  constructor(private _http : HttpClient) { }

  public list(paginationObj: { limit: number,
    offset: number,
    id: number,
    filters: {
      activo: boolean | null,
      nombre: string
    },
    orders: string[]}
    ) {

    
    return this._http.post(environment.apiUrl+"/TiposDeIntegrantes/Paged",paginationObj).pipe(map((res:any) =>{
        const { list , totalCount} = res;
        return {list, totalCount};
    }));
  }

  public create( newTipoInt: ITipoIntegrante):Observable<any> {
    return this._http.post(environment.apiUrl+"/TiposDeIntegrantes", newTipoInt);
  }

  public update( editTipoInt: ITipoIntegrante):Observable<any> {
    return this._http.put(environment.apiUrl+"/TiposDeIntegrantes/" + editTipoInt.id, editTipoInt);
  }

  public delete( id:number ):Observable<any> {
    return this._http.delete(environment.apiUrl+"/TiposDeIntegrantes/"+id);
  }
}
