import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../dto/dto';
import { toSignal } from '@angular/core/rxjs-interop';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {
    this.fetchUnreadCount();
  }
  private static unreadCountState = signal(0);

  public static unreadCount: Signal<number> = NotificationService.unreadCountState.asReadonly();
  // Fetch paginated notifications for current user
  getNotifications(page: number = 0, size: number = 20): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // Mark a single notification as seen
  markAsSeen(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/seen`, {});
  }

  // Mark all notifications as seen
  markAllAsSeen(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/seen-all`, {});
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  clear(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}`);
  }
  plus() {    
    NotificationService.unreadCountState.set(NotificationService.unreadCount()+1);
  }
  minus() {
    let n = NotificationService.unreadCount()
    let res = (n > 0) ? n - 1 : n
    console.log("n=",n);
    console.log("res=",res);
    
    NotificationService.unreadCountState.set(res)
  }
  reset(){
   NotificationService.unreadCountState.set(0) 
  }
  public fetchUnreadCount(): void {
    this.http.get<number>(`${this.baseUrl}/unread-count`).subscribe({
      next: (count) => {
        NotificationService.unreadCountState.set(count);
      },
      error: (err) => {

      }
    });
  }
}
