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
import { PostDetailComponent } from './component/post-detail/post-detail';

export const routes: Routes = [
    { path: "", component: Home, canActivate: [AuthGuard], children: [{ path: "home", component: Feed, children: [{ path: ":id", component: PostDetailComponent }] }, { path: "create", component: PostCompose }, { path: "admin", component: AdminPanel, canActivate: [AdminGuard] }, { path: "profile", component: Profile, canActivate: [AuthGuard] }] },
    { path: "register", component: Register },
    { path: "login", component: Login },
];
