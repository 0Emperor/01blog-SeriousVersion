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
import { ProfileComponent } from './component/profile/profile-component/profile-component';
import { PostEdit } from './component/posts/post-edit/post-edit';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard';
import { AllPosts } from './component/admin/all-posts/all-posts';
import { AllReports } from './component/admin/all-reports/all-reports';
import { AllUsers } from './component/admin/all-users/all-users';
import { NotificationsComponent } from './component/notifications/notification-section/notification-section';
import { UserListComponent } from './component/users/user-list/user-list.component';

export const routes: Routes = [
    { path: "register", component: Register },
    { path: "login", component: Login },
    {
        path: "", component: Home,canActivate: [AuthGuard], children: [
        { path: "", redirectTo: "home", pathMatch: "full" },
        { path: "home", component: Feed },
        { path: "admin", component: AdminDashboardComponent, canActivate: [AdminGuard] },
        { path: "admin/posts", component: AllPosts, canActivate: [AdminGuard] },
        { path: "admin/reports", component: AllReports, canActivate: [AdminGuard] },
        { path: "admin/users", component: AllUsers, canActivate: [AdminGuard] },

        { path: "profile/:username/following", component: UserListComponent },
        { path: "profile/:username/followers", component: UserListComponent },
        { path: "profile/:username", component: ProfileComponent },
        { path: "create", component: PostCompose },
        { path: "create", component: PostCompose },
        { path: "explore", component: Explore },
        { path: "notifications", component: NotificationsComponent },
        { path: "edit/:id", component: PostEdit },
        { path: "post/:id", component: PostView },
        ]
    },
          { path: "**", redirectTo: "home" }


];
