import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FeedSectionComponent } from '../feed-section/feed-section.component';
import { FriendsSectionComponent } from '../friends-section/friends-section.component';
import { MessagesSectionComponent } from '../messages-section/messages-section.component';
import { GameSpaceComponent } from '../game-space/game-space.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FeedSectionComponent, 
    FriendsSectionComponent, 
    MessagesSectionComponent, 
    GameSpaceComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Top Navigation -->
      <nav class="bg-white border-b border-border sticky top-0 z-50">
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
            
            <div class="flex items-center space-x-4" *ngIf="user">
              <div class="flex items-center space-x-2">
                <div class="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {{ getInitials(user.name) }}
                </div>
                <span class="hidden sm:inline">{{ user.name }}</span>
              </div>
              <button 
                class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                (click)="logout()"
              >
                <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="w-full">
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 mb-8">
            <nav class="flex space-x-8">
              <button
                *ngFor="let tab of tabs"
                (click)="activeTab = tab.key"
                [class]="'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ' + (activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
              >
                <div [innerHTML]="tab.icon"></div>
                <span class="hidden sm:inline">{{ tab.label }}</span>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div [ngSwitch]="activeTab">
            <app-feed-section *ngSwitchCase="'feed'" [user]="user!"></app-feed-section>
            <app-friends-section *ngSwitchCase="'friends'" [user]="user!"></app-friends-section>
            <app-messages-section *ngSwitchCase="'messages'" [user]="user!"></app-messages-section>
            <app-game-space *ngSwitchCase="'games'" [user]="user!"></app-game-space>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'feed';

  tabs = [
    {
      key: 'feed',
      label: 'Feed',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
    },
    {
      key: 'friends',
      label: 'Friends',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>'
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>'
    },
    {
      key: 'games',
      label: 'Games',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/']);
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}