// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
// NOTE: You would typically inject a service here using inject()
// import { ToastService } from '../services/toast.service'; 
const EXCLUDE_AUTH_PATH = '/access';
export const authInterceptor: HttpInterceptorFn = (req, next) => {


  const authToken = localStorage.getItem('jwt');

  const authReq = authToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
    : req;
  if (req.url.includes(EXCLUDE_AUTH_PATH)) {
    console.log(`INTERCEPTOR: Skipping toast for URL: ${req.url}`);
    return next(authReq);
  }
  return next(authReq).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        if (event.status === 201) {
          console.log('INTERCEPTOR: Successful creation, showing global success toast.');
        }
      }
    }),

    catchError(error => {
      if (error.status) {
        console.error(`INTERCEPTOR: HTTP Error ${error} caught globally.`, error);

        switch (error.status) {
          case 401:
            console.error('INTERCEPTOR: Unauthorized (401). Redirecting to login...');
            break;
          case 404:
            console.warn('INTERCEPTOR: Resource not found (404).');
            break;
          case 500:
            console.error('INTERCEPTOR: Internal Server Error (500).');
            break;
        }
      }
      return throwError(() => error);
    })
  );
};