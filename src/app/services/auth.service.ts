import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';

import { IResponseList } from '../interfaces/IResponse';
import { IUserDTO } from '../helpers/dtos/IUserDto';
import { IUser } from '../interfaces/IUser';





@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<any | null>;
  public user: Observable<IUser | null>;


  

  constructor(private http: HttpClient, private _localStorage: LocalstorageService) {
        this.userSubject = new BehaviorSubject(_localStorage.getUserData());
        this.user = this.userSubject.asObservable();
   }

  public get userValue() {
    return this.userSubject.value;
  }

  public login(username:string ,password: string):Observable<any>{
     return this.http.post(environment.apiUrl+"/Auth/Login", {username, password}).pipe(catchError((err: HttpErrorResponse) => {
        return this.handleErrors(err);
     })).pipe(map((data: any ) =>{
       console.log(data);
       const { token, roles,idUsuario,email, documento,imagen,nombre } = data;

       this._localStorage.setToken(token);
       this._localStorage.setUserData({
         nombre,
         email,
         documento,
         idUsuario,
         roles,
         imagen
       });
       return data;
     
    }));
  }  

  public logout():void{
     this._localStorage.removeToken();
     this._localStorage.removeUserData();
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

 
  public resetPassword(password:string, confirmPassword:string, email: string, token: string){
    return this.http.post(environment.apiUrl+"/Auth/ResetPassword", {password, confirmPassword, email, token}).pipe(catchError((response: HttpErrorResponse) => {
      const { error } = response;
      if (error.InvalidToken){
        return throwError('Token caducado, vuelve a pedir que te envien un correo para restablecerla');
      }

      if(error.PasswordRequiresLower){
        return throwError('La password debe contener al menos una letra minuscula');

      }

      if(error.PasswordRequiresNonAlphanumeric){
        return throwError('La password debe contener al menos un caracter no alfa numerico($@!.#), etc');

      }

      return throwError('Ha ocurrido un error inesperado');

   }));

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
