import { Component } from '@angular/core';
import { Productcard } from '../productcard/productcard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trending',
  imports: [CommonModule, Productcard],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
  standalone: true,
})
export class Trending {

  trendingProducts = [
    {
      id: 1,
      name: 'Product 1',
      price: 10.99,
      description: 'Description for Product 1',
      image: 'https://via.placeholder.com/300x200/FFC0CB/000000?text=Product1',
      category: 'Category 1',
      rating: 4.5,
      countInStock: 20,
      numReviews: 10
    },
    {
      id: 2,
      name: 'Product 2',
      price: 15.99,
      description: 'Description for Product 2',
      image: 'https://via.placeholder.com/300x200/ADD8E6/000000?text=Product2',
      category: 'Category 2',
      rating: 4.0,
      countInStock: 15,
      numReviews: 8
    },
    // Add more products as needed
  ];
}
