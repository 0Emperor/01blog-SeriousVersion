import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-feed',
  imports: [],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class Feed {
  @Input() api!: string;
}
