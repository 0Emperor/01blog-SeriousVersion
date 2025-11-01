import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  closing: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, title: string, type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = { id: ++this.counter, message, type, title, closing: false };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast])
    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    const toast = this.toastsSubject.value.find(t => t.id === id);
    if (!toast) return;

    toast .closing = true;
    this.toastsSubject.next([...this.toastsSubject.value]);

    setTimeout(() => {
      this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
    }, 300);
  }

}
