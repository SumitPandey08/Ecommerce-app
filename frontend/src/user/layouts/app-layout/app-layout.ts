import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-app-layout',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {

}
