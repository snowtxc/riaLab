import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITipoDocumento } from '../interfaces/ITipoDocumento';
import { environment } from 'src/environments/environment.development';
import { Observable, map } from 'rxjs';
import { PermissionsManagerService } from './permissions.service';
import { Role } from '../helpers/enums/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentosService {



  constructor(private _http : HttpClient) {
    
   }

  public list(paginationObj: { limit: number | null, 
    offset: number |  null,
    id: number |  null,
    filters: {
      activo: boolean |  null,
      nombre: string |  null
    },
    orders: string[]}
    ) {

    
    return this._http.post(environment.apiUrl+"/TiposDeDocumentos/Paged",paginationObj).pipe(map((res:any) =>{
        const { list , totalCount} = res;
        return {list, totalCount};
    }));
  }

  public create( newTipoDoc: ITipoDocumento):Observable<any> {
    return this._http.post(environment.apiUrl+"/TiposDeDocumentos", newTipoDoc);
  }

  public update( editTipoDoc: ITipoDocumento):Observable<any> {
    return this._http.put(environment.apiUrl+"/TiposDeDocumentos/" + editTipoDoc.id, editTipoDoc);
  }

  public delete( id:number ):Observable<any> {
    console.log(id);
    return this._http.delete(environment.apiUrl+"/TiposDeDocumentos/"+id);
  }
}
