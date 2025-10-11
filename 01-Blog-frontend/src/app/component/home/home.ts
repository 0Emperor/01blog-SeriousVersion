import { Component } from '@angular/core';
import { Bar } from "../bar/bar";
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { UserStore } from '../../service/user';
import { ProfileS } from '../../service/profile';

@Component({
  selector: 'app-home',
  imports: [Bar, RouterOutlet, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  isSidebarOpen: boolean = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  constructor(private userService:UserStore,private profile:ProfileS){}
  ngOnInit() {
    this.profile.getCurentUser().subscribe(user => this.userService.setUser(user));
  }
}
