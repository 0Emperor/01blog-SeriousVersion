import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../dto/dto';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

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

  // Get unread notifications count (optional)
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count`);
  }
}
