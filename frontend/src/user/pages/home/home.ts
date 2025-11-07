import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Trending } from '../../components/trending/trending';


@Component({
  selector: 'app-home',
  imports: [Hero, Trending],
  standalone: true,
  providers: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
