import { Component } from '@angular/core';
import { ApiService } from '../../../api-service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupData: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private apiService: ApiService , private router: Router) {}

  onSubmit() {
    if (this.signupData.password !== this.signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      username: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password
    };

    this.apiService.postData('users/signup', payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('Signup successful!');
        sessionStorage.setItem('otp_email', this.signupData.email);
        this.router.navigate(['/otp_verify'], { state: { email: this.signupData.email } });
      },
      error: (error) => {
        console.error(error);
        alert('Signup failed. Please try again.');
      }
    });
  }

}
