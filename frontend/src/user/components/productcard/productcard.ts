import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  countInStock: number;
  numReviews: number;
}
@Component({
  selector: 'app-productcard',
  imports: [RouterLink, CommonModule],
  templateUrl: './productcard.html',
  styleUrl: './productcard.css',
  standalone: true
})


export class Productcard {
  // The product data will be passed from a parent component using @Input()
  @Input() product: Product | null = null;

  constructor() {
  }
}
