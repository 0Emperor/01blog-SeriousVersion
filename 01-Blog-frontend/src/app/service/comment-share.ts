import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../dto/dto';

@Injectable({
  providedIn: 'root'
})
export class CommentShare {
  private comment = new BehaviorSubject<Comment|null>(null); // or any type
  currentComment = this.comment.asObservable();

  changeMessage(comment: Comment) {
    this.comment.next(comment);
  }
}
