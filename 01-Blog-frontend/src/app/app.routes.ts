import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';
import { Register } from './component/register/register';
import { Login } from './component/login/login';
import { AdminPanel } from './component/admin-panel/admin-panel';
import { AdminGuard } from './guard/admin-guard';
import { Profile } from './component/profile/profile';
import { Home } from './component/home/home';
import { Feed } from './component/feed/feed';
import { PostCompose } from './component/post-compose/post-compose';
import { PostView } from './component/post-view/post-view';
import { Explore } from './component/explore/explore';
import { NotificationSection } from './component/notification-section/notification-section';

export const routes: Routes = [
    { path: "register", component: Register },
    { path: "login", component: Login },
    {
        path: "", component: Home, canActivate: [AuthGuard], children: [{ path: "home", component: Feed },
        { path: "admin", component: AdminPanel, canActivate: [AdminGuard] },
        { path: "profile", component: Profile },
        { path: "create", component: PostCompose },
        { path: "create", component: PostCompose },
        { path: "explore", component:  Explore},
        { path: "notifications", component:  NotificationSection},
        { path: ":id", component: PostView },
        ]
    },


];
