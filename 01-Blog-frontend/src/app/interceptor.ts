import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from './service/toast-service';
import { Location } from '@angular/common';

const EXCLUDE_AUTH_PATH = '/access/admin';
interface BackendResponse<T = any> {
  toast?: { message: string; title: string; type: 'success' | 'error' | 'info' | 'warning' };
  body?: T;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authToken = localStorage.getItem('jwt');
  const loc = inject(Location)
  const authReq = authToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
    : req;
  if (req.url.includes(EXCLUDE_AUTH_PATH)) {
    return next(authReq)
  }
  return next(authReq).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const typedBody = event.body as BackendResponse<any>;
        if (typedBody && typedBody.toast) {
          toastService.show(typedBody.toast.message, typedBody.toast.title, typedBody.toast.type);
        } else {
          return event
        }
        return event.clone({ body: typedBody.body ?? {} });
      }

      return event;
    }),

    catchError(error => {
      let message = 'Something went wrong!';
      let title = 'Error'
      let type: "success" | "error" | "info" | "warning" = 'error'
      if (error.error?.toast) {
        message = error.error.toast.message;
        title = error.error.toast.title;
        type = error.error.toast.type;
        toastService.show(message, title, type);
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};
