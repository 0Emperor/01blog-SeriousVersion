import { Component } from '@angular/core';
import { Feed } from "../../feed/feed";

@Component({
  selector: 'app-all-posts',
  imports: [Feed],
  templateUrl: './all-posts.html',
  styleUrl: './all-posts.scss'
})
export class AllPosts {

}
