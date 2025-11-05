import { Routes } from '@angular/router';
import { Signup } from '../user/auth/signup/signup';
import { Login } from '../user/auth/login/login';
import { Otp } from '../user/auth/otp/otp';
import { Home } from '../user/pages/home/home';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'otp_verify', component: Otp },
  { path: '', component: Home }
];
