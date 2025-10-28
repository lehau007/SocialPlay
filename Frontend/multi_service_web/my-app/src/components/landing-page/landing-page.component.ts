import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, AuthModalComponent],
  template: `
    <div class="min-h-screen">
      <!-- Navigation -->
      <nav class="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-xl">SocialPlay</span>
            </div>
            <div class="flex space-x-4">
              <button 
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                (click)="openAuthModal('login')"
              >
                Login
              </button>
              <button 
                class="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                (click)="openAuthModal('signup')"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 class="text-5xl mb-6">
                Connect, Play, and Share with Friends
              </h1>
              <p class="text-xl text-muted-foreground mb-8">
                Join the ultimate social platform where friendship meets gaming. Chat with friends, 
                share your moments, and challenge each other in classic games.
              </p>
              <div class="flex space-x-4">
                <button 
                  class="px-6 py-3 text-lg font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  (click)="openAuthModal('signup')"
                >
                  Get Started
                </button>
                <button 
                  class="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  (click)="openAuthModal('login')"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div class="relative">
              <img
                src="https://images.unsplash.com/photo-1758520388212-04b4d36e1364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGNvbm5lY3Rpb24lMjBmcmllbmRzaGlwfGVufDF8fHx8MTc1ODg5MDc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="People connecting and having fun"
                class="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl mb-4">Everything You Need</h2>
            <p class="text-xl text-muted-foreground">
              Discover all the amazing features that make SocialPlay special
            </p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let feature of features" class="bg-card rounded-lg border border-border p-6 text-center">
              <div class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <div [innerHTML]="feature.icon"></div>
              </div>
              <h3 class="text-lg font-medium mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Game Preview Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="relative">
              <img
                src="https://images.unsplash.com/photo-1662169847892-565cce8f901c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGVzcyUyMGJvYXJkJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzU4ODkwNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Chess and strategy games"
                class="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 class="text-4xl mb-6">
                Challenge Your Mind
              </h2>
              <p class="text-xl text-muted-foreground mb-8">
                Test your strategic thinking with classic games. Play Tic-tac-toe for quick fun 
                or dive deep into Chess matches with friends. Track your wins and improve your skills.
              </p>
              <div class="space-y-4">
                <div *ngFor="let feature of gameFeatures" class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm">✓</span>
                  </div>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl mb-6">
            Ready to Join the Fun?
          </h2>
          <p class="text-xl mb-8 opacity-90">
            Connect with friends, share your stories, and enjoy endless gaming entertainment.
          </p>
          <button 
            class="px-8 py-3 text-lg font-medium text-primary bg-primary-foreground border border-transparent rounded-md hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
            (click)="openAuthModal('signup')"
          >
            Start Playing Now
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-xl">SocialPlay</span>
          </div>
          <p class="text-muted-foreground">
            © 2025 SocialPlay. Connect, Play, Share.
          </p>
        </div>
      </footer>

      <app-auth-modal
        [isOpen]="showAuthModal"
        [mode]="authMode"
        (close)="closeAuthModal()"
        (loginSuccess)="onLoginSuccess()"
      ></app-auth-modal>
    </div>
  `
})
export class LandingPageComponent {
  showAuthModal = false;
  authMode: 'login' | 'signup' = 'login';

  features = [
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>',
      title: "Connect with Friends",
      description: "Build meaningful connections and expand your social network with ease."
    },
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
      title: "Real-time Messaging",
      description: "Chat instantly with friends and stay connected wherever you are."
    },
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      title: "Game Space",
      description: "Challenge friends to classic games like Tic-tac-toe and Chess."
    },
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
      title: "Share Moments",
      description: "Post updates, photos, and thoughts to share with your community."
    },
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>',
      title: "Compete & Win",
      description: "Track your gaming achievements and climb the leaderboards."
    },
    {
      icon: '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      title: "Lightning Fast",
      description: "Enjoy seamless performance and instant interactions."
    }
  ];

  gameFeatures = [
    'Real-time multiplayer gaming',
    'Skill-based matchmaking',
    'Achievement system and leaderboards'
  ];

  constructor(private router: Router) {}

  openAuthModal(mode: 'login' | 'signup') {
    this.authMode = mode;
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  onLoginSuccess() {
    this.showAuthModal = false;
    this.router.navigate(['/dashboard']);
  }
}