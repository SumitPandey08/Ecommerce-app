import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthState, initialAuthState, UserState } from './login/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>(initialAuthState);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const userData = sessionStorage.getItem('user_data');
      const accessToken = sessionStorage.getItem('access_token');
      if (userData && accessToken) {
        const user: UserState = JSON.parse(userData);
        this.authState$.next({
          isAuthenticated: true,
          user: user,
          error: null,
        });
      }
    }
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  login(user: UserState, accessToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('user_data', JSON.stringify(user));
      sessionStorage.setItem('access_token', accessToken);
      this.authState$.next({ isAuthenticated: true, user, error: null });
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('access_token');
      this.authState$.next(initialAuthState);
    }
  }
}