import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IArea } from '../interfaces/IArea';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AreasService {


  constructor(private _http : HttpClient) { }

  public list(paginationObj: { limit?: number,
    offset?: number,
    id?: number,
    filters?: {
      activo?: boolean | null,
      nombre?: string | null
    },
    orders?: string[]}
    ) {

    
    return this._http.post(environment.apiUrl+"/Areas/Paged",paginationObj).pipe(map((res:any) =>{
        const { list, totalCount } = res;
        return {list, totalCount};
    }));
  }

  public create( newTipoDoc: IArea):Observable<any> {
    return this._http.post(environment.apiUrl+"/Areas", newTipoDoc);
  }

  public update( editTipoDoc: IArea):Observable<any> {
    return this._http.put(environment.apiUrl+"/Areas/" + editTipoDoc.id, editTipoDoc);
  }

  public delete( id:number ):Observable<any> {
    return this._http.delete(environment.apiUrl+"/Areas/"+id);
  }

  public listAll( ):Observable<any> {
    return this._http.post(environment.apiUrl+"/Areas/Paged",{page:-1, limit:-1, offset:0, id:0, orders:[], filters:{activo:null, nombre:""}}).pipe(map((res:any) =>{
      const { list } = res;
      return {list};
  }));
  }
  
}
