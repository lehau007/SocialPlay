import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Friend } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-friends-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Search Bar -->
      <div class="bg-card rounded-lg border border-border p-6">
        <div class="relative">
          <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            [(ngModel)]="searchQuery"
            placeholder="Search friends..."
            class="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Friends List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">My Friends ({{ friends.length }})</h2>
            </div>
            <div class="p-4 space-y-4">
              <div *ngFor="let friend of filteredFriends" class="flex items-center justify-between p-4 border border-border rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(friend.name) }}
                    </div>
                    <div [class]="'absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ' + getStatusColor(friend.status)"></div>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ friend.name }}</h4>
                    <p class="text-sm text-muted-foreground">{{ getStatusText(friend) }}</p>
                    <div class="flex items-center space-x-4 mt-1">
                      <span class="text-xs text-muted-foreground">{{ friend.wins }} wins</span>
                      <span class="text-xs text-muted-foreground">{{ friend.mutualFriends }} mutual friends</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    (click)="sendMessage(friend.name)"
                    class="p-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="inviteToGame(friend.name)"
                    [disabled]="friend.status === 'offline'"
                    class="p-2 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Friend Suggestions -->
        <div class="space-y-4">
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Suggested Friends</h2>
            </div>
            <div class="p-4 space-y-4">
              <div *ngFor="let suggestion of suggestions" class="p-4 border border-border rounded-lg">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {{ getInitials(suggestion.name) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium">{{ suggestion.name }}</h4>
                    <p class="text-xs text-muted-foreground">{{ suggestion.mutualFriends }} mutual friends</p>
                    <p class="text-xs text-muted-foreground">{{ suggestion.wins }} wins</p>
                  </div>
                </div>
                <button
                  (click)="addFriend(suggestion.id, suggestion.name)"
                  class="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                >
                  <svg class="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Add Friend
                </button>
              </div>
            </div>
          </div>

          <!-- Online Friends -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Online Now</h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div *ngFor="let friend of onlineFriends" class="flex items-center space-x-3">
                  <div class="relative">
                    <div class="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {{ getInitials(friend.name) }}
                    </div>
                    <div [class]="'absolute -bottom-1 -right-1 w-3 h-3 border border-white rounded-full ' + getStatusColor(friend.status)"></div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ friend.name }}</p>
                    <div *ngIf="friend.status === 'playing' && friend.currentGame" class="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                      {{ friend.currentGame }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FriendsSectionComponent implements OnInit {
  @Input() user!: User;
  
  searchQuery = '';
  friends: Friend[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      status: 'online',
      wins: 15,
      mutualFriends: 3
    },
    {
      id: '2',
      name: 'Sarah Kim',
      status: 'playing',
      currentGame: 'Chess',
      wins: 22,
      mutualFriends: 5
    },
    {
      id: '3',
      name: 'Mike Chen',
      status: 'offline',
      wins: 8,
      mutualFriends: 2
    },
    {
      id: '4',
      name: 'Emma Wilson',
      status: 'playing',
      currentGame: 'Tic-tac-toe',
      wins: 12,
      mutualFriends: 7
    }
  ];

  suggestions = [
    { id: '5', name: 'David Brown', mutualFriends: 4, wins: 18 },
    { id: '6', name: 'Lisa Garcia', mutualFriends: 2, wins: 25 },
    { id: '7', name: 'Tom Anderson', mutualFriends: 6, wins: 11 }
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit() {}

  get filteredFriends(): Friend[] {
    return this.friends.filter(friend =>
      friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get onlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.status !== 'offline');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  }

  getStatusText(friend: Friend): string {
    if (friend.status === 'playing' && friend.currentGame) {
      return `Playing ${friend.currentGame}`;
    }
    return friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
  }

  addFriend(friendId: string, friendName: string) {
    this.toastService.success(`Friend request sent to ${friendName}!`);
  }

  sendMessage(friendName: string) {
    this.toastService.info(`Opening chat with ${friendName}...`);
  }

  inviteToGame(friendName: string) {
    this.toastService.info(`Inviting ${friendName} to play a game...`);
  }
}