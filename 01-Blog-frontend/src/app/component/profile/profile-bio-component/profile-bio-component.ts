import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-bio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-bio-component.html',
  styleUrls: ['./profile-bio-component.scss']
})
export class ProfileBioComponent {
  @Input() bio: string = '';
  @Input() isMe: boolean = false;
  @Output() bioChange = new EventEmitter<string>();

  editableBio: string = '';

  ngOnInit() {
    this.editableBio = this.bio;
  }

  onBioChange(value: string) {
    this.bioChange.emit(value);
  }
}
