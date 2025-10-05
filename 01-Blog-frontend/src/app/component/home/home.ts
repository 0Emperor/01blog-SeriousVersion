import { Component } from '@angular/core';
import { Bar } from "../bar/bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Bar, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
