import { Component, Input } from '@angular/core';
import { Comment } from '../../dto/dto';
import { UserHeaderComponent } from "../user-header/user-header";
import { TimeAgoPipe } from '../../pipe/time-ago-pipe';

@Component({
  selector: 'app-comment-card',
  imports: [UserHeaderComponent,TimeAgoPipe],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.scss'
})
export class CommentCard {
@Input() comment!:Comment
}
