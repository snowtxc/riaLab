import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IResponsabilidades } from '../interfaces/IResponsabilidades';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsabilidadesService {

  constructor(private _http : HttpClient) { }

  public list(paginationObj: { 
    limit: number | null, 
    offset: number |  null,
    id: number |  null,
    filters: {
      activo: boolean |  null,
      nombre: string |  null
    },
    orders: string[]}
    ) {

    return this._http.post(environment.apiUrl+"/Responsabilidades/Paged",paginationObj).pipe(map((res:any) =>{
        const { list , totalCount} = res;
        return {list, totalCount};
    }));
  }

  public create( newTipoDoc: IResponsabilidades):Observable<any> {

    return this._http.post(environment.apiUrl+"/Responsabilidades", newTipoDoc);
  }

  public update( editTipoDoc: IResponsabilidades):Observable<any> {
    return this._http.put(environment.apiUrl+"/Responsabilidades/" + editTipoDoc.id, editTipoDoc);
  }

  public delete( id:number ):Observable<any> {
    return this._http.delete(environment.apiUrl+"/Responsabilidades/"+id);
  }
}
