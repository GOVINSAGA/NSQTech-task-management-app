import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RecordService } from '../../core/services/record.service';
import { ToastService } from '../../core/services/toast.service';
import { RecordItem } from '../../core/models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  records = signal<RecordItem[]>([]);
  isLoadingRecords = signal(true);
  selectedDelay = 2000;
  delayOptions = [
    { value: 0, label: 'No Delay' },
    { value: 1000, label: '1 Second' },
    { value: 2000, label: '2 Seconds' },
    { value: 5000, label: '5 Seconds' },
  ];
  accessNote = signal('');
  recordStats = signal<{ total: number; byStatus: Record<string, number>; byPriority: Record<string, number> } | null>(null);
  elapsedTime = signal(0);
  private timerInterval: any = null;

  constructor(
    public authService: AuthService,
    private recordService: RecordService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.isLoadingRecords.set(true);
    this.elapsedTime.set(0);
    this.records.set([]);

    this.timerInterval = setInterval(() => {
      this.elapsedTime.update((t) => t + 100);
    }, 100);

    this.recordService.getRecords(this.selectedDelay).subscribe({
      next: (response) => {
        clearInterval(this.timerInterval);
        this.records.set(response.records);
        this.accessNote.set(response.meta.accessNote);
        this.recordStats.set(response.stats);
        this.isLoadingRecords.set(false);
        this.toastService.info(`Loaded ${response.records.length} records in ${(this.elapsedTime() / 1000).toFixed(1)}s`);
      },
      error: () => {
        clearInterval(this.timerInterval);
        this.isLoadingRecords.set(false);
        this.toastService.error('Failed to load records');
      },
    });
  }

  showCreateModal = signal(false);
  newTask = {
    title: '',
    description: '',
    category: 'Feature Request',
    priority: 'medium',
    accessLevel: 'general'
  };

  openCreateModal(): void {
    this.newTask = {
      title: '',
      description: '',
      category: 'Feature Request',
      priority: 'medium',
      accessLevel: 'general'
    };
    this.showCreateModal.set(true);
  }

  createTask(): void {
    if (!this.newTask.title || !this.newTask.description) {
      this.toastService.error('Please fill in required fields');
      return;
    }

    this.recordService.createRecord(this.newTask).subscribe({
      next: () => {
        this.toastService.success('Task created successfully');
        this.showCreateModal.set(false);
        this.fetchRecords();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to create task');
      }
    });
  }

  onDelayChange(): void {
    this.fetchRecords();
  }

  getStatusClass(status: string): string {
    return `badge badge-status-${status}`;
  }

  getPriorityClass(priority: string): string {
    return `badge badge-priority-${priority}`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
