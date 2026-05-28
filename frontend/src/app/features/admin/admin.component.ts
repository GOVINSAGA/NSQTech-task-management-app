import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/interfaces';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  users = signal<User[]>([]);
  userStats = signal<{ total: number; active: number; admins: number } | null>(null);
  isLoading = signal(true);
  editingUser = signal<User | null>(null);
  deletingUser = signal<User | null>(null);
  showAddModal = signal(false);

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'general' as 'admin' | 'general',
    department: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.userStats.set(response.stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load users');
      },
    });
  }

  toggleUserRole(user: User): void {
    const newRole = user.role === 'admin' ? 'general' : 'admin';
    this.userService.updateUser(user._id, { role: newRole } as any).subscribe({
      next: (response) => {
        this.users.update((users) =>
          users.map((u) => (u._id === user._id ? response.user : u))
        );
        this.toastService.success(`${user.firstName}'s role changed to ${newRole}`);
        this.loadUsers();
      },
      error: () => this.toastService.error('Failed to update role'),
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.updateUser(user._id, { isActive: !user.isActive } as any).subscribe({
      next: (response) => {
        this.users.update((users) =>
          users.map((u) => (u._id === user._id ? response.user : u))
        );
        this.toastService.success(`${user.firstName} is now ${response.user.isActive ? 'active' : 'inactive'}`);
        this.loadUsers();
      },
      error: () => this.toastService.error('Failed to update status'),
    });
  }

  confirmDelete(user: User): void {
    this.deletingUser.set(user);
  }

  deleteUser(): void {
    const user = this.deletingUser();
    if (!user) return;

    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u._id !== user._id));
        this.deletingUser.set(null);
        this.toastService.success(`${user.firstName} ${user.lastName} has been removed`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete user');
        this.deletingUser.set(null);
      },
    });
  }

  openAddModal(): void {
    this.newUser = { firstName: '', lastName: '', email: '', password: '', role: 'general', department: '' };
    this.showAddModal.set(true);
  }

  addUser(): void {
    if (!this.newUser.firstName || !this.newUser.email || !this.newUser.password) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    const http = (this.userService as any).http;
    const apiUrl = environment.apiUrl;
    http.post(`${apiUrl}/auth/register`, this.newUser).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.toastService.success('User created successfully');
        this.loadUsers();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Failed to create user');
      },
    });
  }

  isCurrentUser(user: User): boolean {
    return this.authService.currentUser()?._id === user._id;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
