import { Component, OnDestroy, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { UserState } from '../../auth/login/auth.state';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  userState: UserState | null = null;
  isDropdownOpen = false;
  isNavOpen = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

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

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
    if (this.isNavOpen) {
      this.renderer.addClass(document.body, 'nav-open');
    } else {
      this.renderer.removeClass(document.body, 'nav-open');
    }
  }

  closeNav() {
    if (this.isNavOpen) {
      this.isNavOpen = false;
      this.renderer.removeClass(document.body, 'nav-open');
    }
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