import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../dto/dto';
import { UserHeaderComponent } from "../user-header/user-header";
import { TimeAgoPipe } from '../../pipe/time-ago-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-card',
  imports: [UserHeaderComponent,TimeAgoPipe,FormsModule],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.scss'
})
export class CommentCard {
@Input() comment!:Comment
@Output() edited = new EventEmitter<string>(); // new text
@Output() deleted = new EventEmitter<void>();

editing = false;
editText = '';
emojiPickerVisible = false;

openEmojiPicker() {
  this.emojiPickerVisible = !this.emojiPickerVisible;
  console.log('Emoji picker is now:', this.emojiPickerVisible ? 'open' : 'closed');
}

addEmoji(emoji: string) {
  this.comment.content+=emoji;
  this.emojiPickerVisible = false; // optionally close after picking
}

ngOnChanges() {
  this.editText = this.comment.content; // reset when input changes
}

startEdit() {
  this.editing = true;
}
update(newc: string){
// this.
}
cancelEdit() {
  this.editing = false;
  this.editText = this.comment.content;
}

saveEdit() {
  this.editing = false;
  this.edited.emit(this.editText);
}
}
