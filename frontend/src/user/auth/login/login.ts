import { Component } from '@angular/core';
import { ApiService } from '../../../api-service';
import { FormsModule } from '@angular/forms';

interface User{
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  loginData: User = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService) {}

  onSubmit() {
    const payload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.apiService.postData('http://localhost:5000/api/users/login', payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('Login successful!');
      },
      error: (error) => {
        console.error(error);
        alert('Login failed. Please try again.');
      }
    });
  }

}
