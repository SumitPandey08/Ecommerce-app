import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OtpData {
  email: string;
  otp: string;
}

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp implements OnInit {
  otpData: OtpData = {
    email: '',
    otp: ''
  };

  constructor(private apiService: ApiService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.otpData.email = navigation?.extras?.state?.['email'] ?? '';
  }

  ngOnInit(): void {
    if (!this.otpData.email) {
      console.error('Email not provided for OTP verification.');
      // Optionally, navigate back to signup or show an error
      this.router.navigate(['/signup']);
    }
  }

  onSubmit() {
    const payload = {
      email: this.otpData.email,
      otp: this.otpData.otp
    };

    this.apiService.postData('http://localhost:5000/api/users/verify', payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('OTP verified successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        alert('OTP verification failed. Please try again.');
      }
    });
  }

  onResendOTP() {
    const payload = {
      email: this.otpData.email
    };
    this.apiService.postData('http://localhost:5000/api/users/resend-otp', payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('A new OTP has been sent to your email.');
      },
      error: (error) => {
        console.error(error);
        alert('Failed to resend OTP. Please try again.');
      }
    });
  }
}
