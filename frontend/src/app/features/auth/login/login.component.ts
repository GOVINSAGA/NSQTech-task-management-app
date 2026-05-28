import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.toastService.success(`Welcome back, ${response.user.firstName}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (errorMessage) => {
        this.isLoading.set(false);
        this.toastService.error(typeof errorMessage === 'string' ? errorMessage : 'Login failed');
      },
    });
  }

  fillCredentials(type: 'admin' | 'general'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({ email: 'admin@nsqtech.com', password: 'Admin@123' });
    } else {
      this.loginForm.patchValue({ email: 'user@nsqtech.com', password: 'User@123' });
    }
  }
}
