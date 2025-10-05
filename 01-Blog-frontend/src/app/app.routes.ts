import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';
import { App } from './app';
import { Register } from './component/register/register';
import { Login } from './component/login/login';
import { AdminPanel } from './component/admin-panel/admin-panel';
import { AdminGuard } from './guard/admin-guard';
import { Profile } from './component/profile/profile';
import { Home } from './component/home/home';
import { Component } from '@angular/core';
import { Feed } from './component/feed/feed';

export const routes: Routes = [
    { path: "", component: Home, canActivate: [AuthGuard] ,children:[{path:"home",component:Feed},{ path: "admin", component: AdminPanel, canActivate: [AdminGuard] },{ path: "profile", component: Profile, canActivate: [AuthGuard] }]},
    { path: "register", component: Register },
    { path: "login", component: Login },
];
