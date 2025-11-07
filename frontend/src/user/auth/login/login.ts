import { Component } from '@angular/core';
import { ApiService } from '../../../api-service';
import { FormsModule } from '@angular/forms';
import { Router , RouterLink } from '@angular/router';
import { UserState } from './auth.state';
import { AuthService } from '../auth.service';


interface LoginResponse {
  message: string;
  user: UserState;
  accessToken: string;
}

interface User{
  email: string;
  password: string;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, RouterLink ],
  templateUrl: './login.html',
  styleUrls: ['./login.css',],
  providers: [ApiService]
})

export class Login {
  loginData: User = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService , private router: Router, private authService: AuthService) {}

  onSubmit() {
    const payload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.apiService.postData<LoginResponse>('users/login', payload).subscribe({
      next: (response) => {

        console.log(response);
        alert('Login successful!');

        this.authService.login(response.user, response.accessToken);

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        alert('Login failed. Please try again.');
      }
    });
  }

}
