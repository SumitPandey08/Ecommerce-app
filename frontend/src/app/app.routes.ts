import { Routes } from '@angular/router';
import { Signup } from '../user/auth/signup/signup';
import { Login } from '../user/auth/login/login';
import { Otp } from '../user/auth/otp/otp';
import { Home } from '../user/pages/home/home';
import { About } from '../user/pages/about/about';
import { AuthLayout } from '../user/layouts/auth-layout/auth-layout';
import { AppLayout } from '../user/layouts/app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'about',
        component: About
      }
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'signup',
        component: Signup
      },
      {
    path: 'login',
    component: Login
  },
  {
    path: 'otp_verify',
    component: Otp
  }
]
  }
]


