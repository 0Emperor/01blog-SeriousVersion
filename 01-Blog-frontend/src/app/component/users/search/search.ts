import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  @Input() loading: boolean = false;
  @Input() hasMore: boolean = false;
  @Output() followed = new EventEmitter<number>();
  @Output() searched = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  missing = inject(AvatarMissingService)

  get fillteredUsers() {
    return this.users;
  }

  filter(query?: string) {
    this.searched.emit(query || '');
  }

  follow(i: number) {
    this.followed.emit(i)
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
