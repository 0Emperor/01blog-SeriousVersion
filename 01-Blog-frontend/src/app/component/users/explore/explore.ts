import { Component, inject, signal } from '@angular/core';
import { ExploreSrvs } from '../../../service/explore';
import { User } from '../../../dto/dto';
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

  notFollowed = signal<{ user: User, indexe: number }[]>([])
  arrived = signal(false)
  loading = signal(false)
  page = 0
  hasMore = signal(true)
  searchQuery = ''

  ngOnInit() {
    this.loadUsers(true);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadUsers(true);
  }

  loadUsers(reset: boolean = false) {
    if (this.loading() && !reset) return;
    this.loading.set(true);

    if (reset) {
      this.notFollowed.set([]);
      this.page = 0;
      this.hasMore.set(true);
    }

    this.explore.getAll(this.page, 20, this.searchQuery || undefined).subscribe({
      next: (response) => {
        const newUsers = response.content.map((user: User, index: number) => ({
          user,
          indexe: this.notFollowed().length + index
        }));

        this.notFollowed.update(current => [...current, ...newUsers]);
        this.hasMore.set(!response.last);
        this.page++;
        this.arrived.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.arrived.set(true);
        this.loading.set(false);
      }
    });
  }

  get usersWithIndex() {
    return this.notFollowed();
  }

  follow(index: number) {
    const userToFollow = this.notFollowed()[index];
    if (!userToFollow) return;

    this.followS.follow(userToFollow.user.id).subscribe({
      next: () => {
        this.notFollowed.update(users => users.filter((_, i) => i !== index));
      }
    });
  }
}
