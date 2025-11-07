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
  loading = false;
  message = '';

  constructor(private apiService: ApiService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    // First, try to get email from router state
    let email = navigation?.extras?.state?.['email'];
    if (!email) {
      // If not found (e.g., on page refresh), try getting it from sessionStorage
      email = sessionStorage.getItem('otp_email');
    }
    this.otpData.email = email ?? '';
  }

  ngOnInit(): void {
    if (!this.otpData.email) {
      console.error('Email not provided for OTP verification.');
      // Optionally, navigate back to signup or show an error
      this.router.navigate(['/signup']);
    }
  }

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.apiService.verifyOtp(this.otpData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log(response);
        this.message = 'OTP verified successfully!';
        sessionStorage.removeItem('otp_email'); // Clean up session storage
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
        this.message = 'OTP verification failed. Please try again.';
      }
    });
  }

  onResendOTP() {
    this.loading = true;
    this.message = '';
    this.apiService.resendOtp({ email: this.otpData.email }).subscribe({
      next: (response) => {
        this.loading = false;
        console.log(response);
        this.message = 'A new OTP has been sent to your email.';
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
        this.message = 'Failed to resend OTP. Please try again.';
      }
    });
  }
}
