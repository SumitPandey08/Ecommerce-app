import { Component, OnDestroy, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserState } from '../../auth/login/auth.state';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  userState: UserState | null = null;
  
  isDropdownOpen = false;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthState().subscribe(state => {
      this.userState = state.user;
      if (!this.userState) {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
