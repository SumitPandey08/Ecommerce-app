import { Routes } from '@angular/router';
import { Signup } from '../user/auth/signup/signup';
import { Login } from '../user/auth/login/login';
import { Otp } from '../user/auth/otp/otp';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'otp_verify', component: Otp }
];
