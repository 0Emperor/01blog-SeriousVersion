import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../dto/dto';

@Component({
  selector: 'app-mutuals-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mutuals-preview-component.html',
  styleUrls: ['./mutuals-preview-component.scss']
})
export class MutualsPreviewComponent {
  @Input() people: User[] = [];
  getInitial(username: string): string {
    return username ? username.charAt(0).toUpperCase() : '?';
  }

  getBackgroundColor(username: string): string {
    const colors = ['#6a5acd', '#ff7f50', '#20b2aa', '#dc143c', '#1e90ff'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
