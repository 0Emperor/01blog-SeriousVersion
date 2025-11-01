import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from './service/toast-service';

const EXCLUDE_AUTH_PATH = '/access/admin';
interface BackendResponse<T = any> {
  toast?: { message: string; title: string; type: 'success' | 'error' | 'info' | 'warning' };
  body?: T;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authToken = localStorage.getItem('jwt');

  const authReq = authToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
    : req;
  return next(authReq).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const typedBody = event.body as BackendResponse<any>;
        if (typedBody&&typedBody.toast) {
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
      let type: "success" | "error" | "info" | "warning"  = 'error'
      if (error.error?.toast) message = error.error.toast.message;
      if (error.error?.toast) title = error.error.toast.title;
      if (error.error?.toast) type = error.error.toast.type;
      if (error.error?.toast) toastService.show(message, title, type);
      return throwError(() => error);
    })
  );
};
