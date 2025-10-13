import { Component, Input } from '@angular/core';
import { Post } from '../../dto/dto';
import { Router, RouterLink } from '@angular/router';
import { UserHeaderComponent } from '../user-header/user-header';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-feed',
  imports: [RouterLink,UserHeaderComponent,DatePipe],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss'
})
export class PostFeed {
@Input() post!:Post;
constructor(private router: Router){}

}
