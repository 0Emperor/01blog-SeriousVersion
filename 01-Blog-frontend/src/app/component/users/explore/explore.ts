import { Component, inject } from '@angular/core';
import { ExploreSrvs } from '../../../service/explore';
import { User } from '../../../dto/dto';
import { UserHeaderComponent } from '../user-header/user-header';
import { Follow } from '../../../service/follow';
import { Search } from "../search/search";

@Component({
  selector: 'app-explore',
  imports: [Search],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore {
  explore = inject(ExploreSrvs)
  followS = inject(Follow)
  notFollowed: User[] = []
  arrived = false
  ngOnInit() {
    this.explore.getAll().subscribe({
      next: (d) => {
        this.notFollowed = d;
        this.arrived = true
      }, error: () => {
        this.arrived = true
      }
    }
    )
  }
  get usersWithIndex() {
    return this.notFollowed.map((n, i) => ({ user: n, indexe: i }));
  }

  follow(index: number) {
    this.followS.follow(this.notFollowed[index].id).subscribe({
      next: () => {
        this.notFollowed = [...this.notFollowed.slice(0, index), ...this.notFollowed.slice(index + 1)]
      }
    })
  }
}
