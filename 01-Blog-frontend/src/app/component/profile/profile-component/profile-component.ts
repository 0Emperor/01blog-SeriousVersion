import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileDto, User } from '../../../dto/dto';
import { ProfileService } from '../../../service/profile-service';
import { Follow } from '../../../service/follow';
import { ProfileHeaderComponent } from "../profile-header-component/profile-header-component";
import { ProfileBioComponent } from '../profile-bio-component/profile-bio-component';
import { ProfileStatsComponent } from '../profile-stats-component/profile-stats-component';
import { Feed } from '../../feed/feed';
import { UserStore } from '../../../service/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.scss'],
  imports: [ProfileHeaderComponent, ProfileBioComponent, ProfileStatsComponent, Feed]
})
export class ProfileComponent implements OnInit {
  profile: ProfileDto | null = null;
  username: string = '';
  bio: string = ''
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private followService: Follow,
    private userStore: UserStore,
    private router: Router
  ) { }
  udpatebio(nBio: string) {
    this.bio = nBio;
  }
  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') || '';
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile(this.username).subscribe({
      next: (data) => this.profile = data,
      error: (err) => console.error(err)
    });
  }

  /** Handle Save button click (own profile) */
  onSave({ username, file }: { username?: string; file?: File }) {
    if (!username && !file) {
      return;
    }
    this.profileService.updateProfile(username, this.bio, file).subscribe(({ user, jwt }) => {
      if (this.profile) this.profile.user = user;
      localStorage.setItem("jwt", jwt)
      this.userStore.setUser(user)
      this.router.navigate(['profile', user.username])
    });
  }

  /** Handle Follow/Unfollow button click (other users) */
  onFollowToggle() {
    if (!this.profile) return;

    const uid = this.profile.user.id;

    if (this.profile.isFollowing) {
      this.followService.unfollow(uid).subscribe({
        next: () => {
          console.log("ohhhh")
          if (this.profile) this.profile.isFollowing = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.followService.follow(uid).subscribe({
        next: () => {
          if (this.profile) this.profile.isFollowing = true;
        },
        error: (err) => console.error(err)
      });
    }
  }
}
