import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div 
      *ngIf="isOpen" 
      class="fixed inset-0 z-[9999] overflow-y-auto bg-black/50"
      (click)="onBackdropClick($event)"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Modal panel -->
        <div 
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[10000]"
          (click)="$event.stopPropagation()"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Welcome to SocialPlay
                </h3>
                
                <!-- Tab Navigation -->
                <div class="mb-6">
                  <nav class="flex space-x-4 border-b border-gray-200">
                    <button
                      (click)="activeTab = 'login'"
                      [class]="'py-2 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
                    >
                      Login
                    </button>
                    <button
                      (click)="activeTab = 'signup'"
                      [class]="'py-2 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
                    >
                      Sign Up
                    </button>
                  </nav>
                </div>

                <!-- Login Form -->
                <form *ngIf="activeTab === 'login'" (ngSubmit)="onLogin()" class="space-y-4">
                  <div>
                    <label for="login-email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      [(ngModel)]="loginForm.email"
                      placeholder="Enter your email"
                      required
                      autofocus
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      [(ngModel)]="loginForm.password"
                      placeholder="Enter your password"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    [disabled]="isLoading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {{ isLoading ? 'Logging in...' : 'Log In' }}
                  </button>
                  <div class="text-center text-sm text-gray-500">
                    <p>Demo: Use any email and password to login</p>
                  </div>
                </form>

                <!-- Signup Form -->
                <form *ngIf="activeTab === 'signup'" (ngSubmit)="onSignup()" class="space-y-4">
                  <div>
                    <label for="signup-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      [(ngModel)]="signupForm.name"
                      placeholder="Enter your full name"
                      required
                      autofocus
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      [(ngModel)]="signupForm.email"
                      placeholder="Enter your email"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      [(ngModel)]="signupForm.password"
                      placeholder="Create a password"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="signup-confirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      id="signup-confirm"
                      name="confirmPassword"
                      type="password"
                      [(ngModel)]="signupForm.confirmPassword"
                      placeholder="Confirm your password"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    [disabled]="isLoading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {{ isLoading ? 'Signing up...' : 'Sign Up' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              (click)="closeModal()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Input() isOpen = false;
  @Input() mode: 'login' | 'signup' = 'login';
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  activeTab: 'login' | 'signup' = 'login';
  isLoading = false;

  loginForm = {
    email: '',
    password: ''
  };

  signupForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnChanges() {
    this.activeTab = this.mode;
    console.log('Auth modal opened with mode:', this.mode);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForms();
  }

  onLogin() {
    console.log('Login form data:', this.loginForm);
    if (!this.loginForm.email || !this.loginForm.password) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (user) => {
        this.toastService.success('Successfully logged in!');
        this.loginSuccess.emit();
        this.resetForms();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Login failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  onSignup() {
    console.log('Signup form data:', this.signupForm);
    if (!this.signupForm.name || !this.signupForm.email || !this.signupForm.password || !this.signupForm.confirmPassword) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    if (this.signupForm.password.length < 6) {
      this.toastService.error('Password must be at least 6 characters');
      return;
    }

    this.isLoading = true;
    this.authService.signup(this.signupForm.name, this.signupForm.email, this.signupForm.password).subscribe({
      next: (user) => {
        this.toastService.success('Successfully signed up!');
        this.loginSuccess.emit();
        this.resetForms();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Signup failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  private resetForms() {
    this.loginForm = { email: '', password: '' };
    this.signupForm = { name: '', email: '', password: '', confirmPassword: '' };
  }
}