import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';
import { App } from './app';
import { Register } from './component/register/register';
import { Login } from './component/login/login';
import { AdminPanel } from './component/admin-panel/admin-panel';

export const routes: Routes = [
    { path: "", component: App, canActivate: [AuthGuard] },
    { path: "register", component: Register },
    { path: "login", component: Login },
    { path: "admin", component: AdminPanel, canActivate: [AuthGuard] }
];
