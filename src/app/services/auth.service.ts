import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private _localStorage: LocalstorageService) { }

  public login(username:string ,password: string):Observable<any>{
     return this.http.post(environment.apiUrl+"/Auth/Login", {username, password}).pipe(catchError((err: HttpErrorResponse) => {
        return this.handleErrors(err);
     })).pipe(map((data: any ) =>{
       const { token } = data;
       this._localStorage.setToken(token);
       return data;
     
    }));
  }

  public logout():void{
     this._localStorage.removeToken();
  }

  public isLogged(): boolean{
     if(!this._localStorage.getToken()){
      return false;
     }
     return true;
  }


  handleErrors(error: HttpErrorResponse): Observable<never>  {
    if (error.status == HttpStatusCode.Unauthorized)
      return throwError('Credenciales invalidas');

    return throwError('Un error inesperado ha ocurrido.');
  }
  
}
