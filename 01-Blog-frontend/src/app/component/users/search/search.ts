import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../dto/dto';
import { AvatarMissingService } from '../../../service/avatar-missing-service';
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-search',
  imports: [NgClass, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
  @Input() users!: { user: User, indexe: number }[]
  @Output() followed = new EventEmitter<number>();
  missing = inject(AvatarMissingService)
  fillter?: string;
  get fillteredUsers() {
    if (this.fillter) return this.users.filter(u => (u.user.name?.includes(this.fillter as string) || u.user.username.includes(this.fillter as string)))
    return this.users
  }
  filter(subName?: string) {
    this.fillter = subName
  }
  follow(i: number) {
    this.followed.emit(i)
  }
}
