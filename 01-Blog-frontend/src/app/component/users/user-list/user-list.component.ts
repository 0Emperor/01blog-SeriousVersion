import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Follow } from '../../../service/follow';
import { UserFollowDto } from '../../../dto/dto';
import { AvatarMissingService } from '../../../service/avatar-missing-service';
import { ToastService } from '../../../service/toast-service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    route = inject(ActivatedRoute);
    followService = inject(Follow);
    missing = inject(AvatarMissingService);
    toastService = inject(ToastService);

    type: 'followers' | 'following' = 'followers';
    username: string = '';
    users = signal<UserFollowDto[]>([]);
    loading = signal(false);
    page = 0;
    hasMore = signal(true);
    searchQuery = signal('');

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log(params);

            this.username = params['username'];
            const path = this.route.snapshot.url[2]?.path;
            if (path === 'followers' || path === 'following') {
                this.type = path;
            }
            this.loadUsers(true);
        });
    }

    onSearch(query: string) {
        this.searchQuery.set(query);
        this.loadUsers(true);
    }

    loadUsers(reset: boolean = false) {
        if (this.loading() && !reset) return;
        this.loading.set(true);
        if (reset) {
            this.users.set([]);
            this.page = 0;
            this.hasMore.set(true);
        }

        const apiCall = this.type === 'following'
            ? this.followService.getFollowing(this.username, this.page, 20, this.searchQuery())
            : this.followService.getFollowers(this.username, this.page, 20, this.searchQuery());

        apiCall.subscribe({
            next: (data) => {
                const newUsers = data.content;
                this.users.update(current => [...current, ...newUsers]);
                this.hasMore.set(!data.last);
                this.page++;
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    toggleFollow(user: UserFollowDto) {
        const apiCall = user.isFollowing
            ? this.followService.unfollow(user.userId)
            : this.followService.follow(user.userId);

        apiCall.subscribe({
            next: () => {
                user.isFollowing = !user.isFollowing;
                if (user.isFollowing) {
                    this.toastService.show("User followed successfully", "Success", "success");
                } else {
                    this.toastService.show("User unfollowed successfully", "Success", "success");
                }
            },
            error: (err) => console.error(err)
        });
    }
}
