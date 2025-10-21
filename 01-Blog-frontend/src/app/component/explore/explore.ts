import { Component, inject } from '@angular/core';
import { ExploreSrvs } from '../../service/explore';
import { User } from '../../dto/dto';
import { UserHeaderComponent } from '../user-header/user-header';
import { Follow } from '../../service/follow';

@Component({
  selector: 'app-explore',
  imports: [UserHeaderComponent],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore {
  explore = inject(ExploreSrvs)
  followS = inject(Follow)
  notFollowed: User[] = []
  ngOnInit() {
    this.explore.getAll().subscribe((d) => {
      this.notFollowed = d;
    })
  }
  follow(index: number) {
    this.followS.follow(this.notFollowed[index].id).subscribe({
      next: () => {
        this.notFollowed = [...this.notFollowed.slice(0, index), ...this.notFollowed.slice(index + 1)]
      }
    })
  }
}
