import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <app-navbar />
    }
    <main>
      <router-outlet />
    </main>
    <app-toast />
  `,
  styles: `
    main {
      min-height: calc(100vh - 60px);
    }
  `,
})
export class App {
  constructor(public authService: AuthService) {}
}
