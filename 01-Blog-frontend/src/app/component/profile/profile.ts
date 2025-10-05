import { Component, inject, signal } from '@angular/core';
import { ProfileS } from '../../service/profile';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  name = signal("wrong claim name")
  prf = inject(ProfileS)
  get() {
    this.prf.getName().subscribe({
      next: (d) => {
        this.name.set(d["name"])
      },
      error:(e)=>{
        console.log(e)
        this.name.set(e)
      }
    })
  }
}
