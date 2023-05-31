import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponseBase
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LocalstorageService } from '../services/localstorage.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _localStorage:LocalstorageService, private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._localStorage.getToken();
    if (token) {
      console.log('hola')
      request = request.clone({
         setHeaders: {Authorization: `bearer ${token}`}
      });
    }
    return next.handle(request).pipe(catchError((err)=>{
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigateByUrl("/login");
        }
      }
      return throwError(err);

    }));
  }

    

  
}
