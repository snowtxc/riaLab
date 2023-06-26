import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';

import { IResponseList } from '../interfaces/IResponse';
import { IUserDTO } from '../helpers/dtos/IUserDto';





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
     //checkear si ha expirado
     return true;
  }

  public listUsers(paginationObj: {
    limit: number,
    offset: number,
    id: number,
    
    filters: {
      activo?: boolean | null ,
      nombre?: string,
      idUsuario?: string,
      username?: string,
      email?: string,
      documento?: string
        
    },
    orders: string[]}
    ) : Observable<IResponseList>{

    return this.http.post<IResponseList>(environment.apiUrl+"/Auth/Users",paginationObj);
  }

  public createUser( newUser: IUserDTO):Observable<any> {
    return this.http.post(environment.apiUrl+"/Auth/Register", newUser).pipe(catchError((err: HttpErrorResponse) => {
      return this.handleErrors(err);
    }))

  }

  public updateUser( editUser: IUserDTO):Observable<any> {
    return this.http.put(environment.apiUrl+"/Auth/Users", editUser).pipe(catchError((err: HttpErrorResponse) => {
      return this.handleErrors(err);
   }));
  }

  public forgotPassword( email:string ):Observable<any> {
    return this.http.post(environment.apiUrl+"/Auth/ForgotPassword", {email}).pipe(catchError((err: HttpErrorResponse) => {
      return this.handleErrors(err);
   }))
  }


  public getRoles():Observable<string[]>{
    return this.http.get<string[]>(environment.apiUrl+"/Auth/Users/Roles");
  }


  public addRoleToUser(userId:string, roleId:string):Observable<any>{
    return this.http.post(environment.apiUrl+"/Auth/Users/UserRoles", {userId, roleId}).pipe(catchError((err: HttpErrorResponse) => {
      return this.handleErrors(err);
   }));
  }

  public removeRoleToUser(userId:string, roleId:string):Observable<any>{
    const body = {
      userId,
      roleId
    }
    return this.http.request("delete" ,environment.apiUrl+"/Auth/Users/UserRoles" , {body: body}).pipe(catchError((err: HttpErrorResponse) => {
      return this.handleErrors(err);
   }));;
  }  



  handleErrors(error: HttpErrorResponse): Observable<never>  {
    if (error.status == HttpStatusCode.Unauthorized)
      return throwError('Credenciales invalidas');

      
    if(!error.error.status){
      return throwError(error.error.mensaje);

    }
    return throwError('Un error inesperado ha ocurrido.');
  }
  
}
