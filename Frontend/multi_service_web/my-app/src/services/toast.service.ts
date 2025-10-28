import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  success(message: string, duration: number = 3000): void {
    this.showToast(message, 'success', duration);
  }

  error(message: string, duration: number = 3000): void {
    this.showToast(message, 'error', duration);
  }

  info(message: string, duration: number = 3000): void {
    this.showToast(message, 'info', duration);
  }

  warning(message: string, duration: number = 3000): void {
    this.showToast(message, 'warning', duration);
  }

  private showToast(message: string, type: Toast['type'], duration: number): void {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }
}