import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';
import { Register } from './component/auth/register/register';
import { Login } from './component/auth/login/login';
import { AdminPanel } from './component/users/admin-panel/admin-panel';
import { AdminGuard } from './guard/admin-guard';
import { Home } from './component/main/home/home';
import { Feed } from './component/feed/feed';
import { PostCompose } from './component/posts/post-compose/post-compose';
import { PostView } from './component/posts/post-view/post-view';
import { Explore } from './component/users/explore/explore';
import { NotificationSection } from './component/notifications/notification-section/notification-section';
import { ProfileComponent } from './component/profile/profile-component/profile-component';

export const routes: Routes = [
    { path: "register", component: Register },
    { path: "login", component: Login },
    {
        path: "", component: Home, canActivate: [AuthGuard], children: [{ path: "home", component: Feed },
        { path: "admin", component: AdminPanel, canActivate: [AdminGuard] },
        { path: "profile/:username", component: ProfileComponent },
        { path: "create", component: PostCompose },
        { path: "create", component: PostCompose },
        { path: "explore", component:  Explore},
        { path: "notifications", component:  NotificationSection},
        { path: ":id", component: PostView },
        ]
    },


];
