import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title:string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([
    { id: 1,title:"testsing", message: 'Your profile has been updated successfully!', type: 'success' },
    { id: 2,title:"testsing", message: 'Failed to save changes. Please try again later.', type: 'error' },
    { id: 3,title:"testsing", message: 'New version available! Refresh to update.', type: 'info' },
    { id: 4,title:"testsing", message: 'You are approaching your storage limit.', type: 'warning' }
  ]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, title:string,type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = { id: ++this.counter, message, type ,title};
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast])
    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    console.log(id);
    
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
