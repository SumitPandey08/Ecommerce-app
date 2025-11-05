import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Navbar } from '../../components/navbar/navbar';
import { Trending } from '../../components/trending/trending';


@Component({
  selector: 'app-home',
  imports: [Hero, Navbar, Trending],
  standalone: true,
  providers: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
