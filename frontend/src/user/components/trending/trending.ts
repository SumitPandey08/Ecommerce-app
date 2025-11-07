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
      name: 'Classic Leather Watch',
      price: 150.0,
      description: 'A timeless leather watch for any occasion.',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D',
      category: 'Accessories',
      rating: 4.5,
      countInStock: 20,
      numReviews: 10,
      isNew: true,
    },
    {
      id: 2,
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      description: 'High-fidelity sound in a sleek, comfortable design.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Electronics',
      rating: 4.0,
      countInStock: 15,
      numReviews: 8,
      isNew: false,
    },
    {
      id: 3,
      name: 'Modern Running Shoes',
      price: 120.5,
      description: 'Lightweight and responsive for your daily run.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Footwear',
      rating: 4.8,
      countInStock: 30,
      numReviews: 25,
      isNew: true,
    },
    {
      id: 4,
      name: 'Stylish Sunglasses',
      price: 75.0,
      description: 'Protect your eyes with these fashionable sunglasses.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Accessories',
      rating: 4.2,
      countInStock: 50,
      numReviews: 15,
      isNew: false,
    },
  ];
}
