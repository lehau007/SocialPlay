import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { TicTacToeGameComponent } from '../games/tic-tac-toe-game/tic-tac-toe-game.component';
import { ChessGameComponent } from '../games/chess-game/chess-game.component';

@Component({
  selector: 'app-game-space',
  standalone: true,
  imports: [CommonModule, TicTacToeGameComponent, ChessGameComponent],
  template: `
    <div *ngIf="activeGame === 'lobby'" class="max-w-6xl mx-auto space-y-6">
      <!-- Game Lobby Header -->
      <div class="text-center">
        <h1 class="text-3xl mb-2">Game Space</h1>
        <p class="text-muted-foreground">Challenge friends and test your skills</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Game Selection -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Available Games -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Choose Your Game</h2>
            </div>
            <div class="p-4 grid md:grid-cols-2 gap-4">
              <div 
                (click)="startGame('tictactoe')"
                class="bg-card border border-border rounded-lg p-6 text-center cursor-pointer hover:shadow-md transition-shadow"
              >
                <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <div class="grid grid-cols-3 gap-1">
                    <div *ngFor="let i of [1,2,3,4,5,6,7,8,9]" class="w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <h3 class="text-lg font-medium mb-2">Tic-tac-toe (Caro)</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Quick strategy game for fast-paced fun
                </p>
                <button class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Play Now
                </button>
              </div>

              <div 
                (click)="startGame('chess')"
                class="bg-card border border-border rounded-lg p-6 text-center cursor-pointer hover:shadow-md transition-shadow"
              >
                <div class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <div class="text-2xl">♟️</div>
                </div>
                <h3 class="text-lg font-medium mb-2">Chess</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Classic strategy game for deep thinking
                </p>
                <button class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Play Now
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Games -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Recent Games</h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div *ngFor="let game of recentGames" class="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      {{ game.game === 'Chess' ? '♟️' : '⭕' }}
                    </div>
                    <div>
                      <h4 class="text-sm font-medium">{{ game.game }} vs {{ game.opponent }}</h4>
                      <div class="flex items-center space-x-2 text-xs text-muted-foreground">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{{ game.duration }}</span>
                      </div>
                    </div>
                  </div>
                  <div [class]="'px-2 py-1 rounded text-xs ' + (game.result === 'Won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                    {{ game.result }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Player Stats -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium flex items-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                <span>Your Stats</span>
              </h2>
            </div>
            <div class="p-4 space-y-4">
              <div class="text-center">
                <div class="text-2xl font-medium mb-1">{{ stats.winRate }}%</div>
                <div class="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-xl font-medium">{{ stats.totalGames }}</div>
                  <div class="text-xs text-muted-foreground">Total Games</div>
                </div>
                <div>
                  <div class="text-xl font-medium">{{ stats.wins }}</div>
                  <div class="text-xs text-muted-foreground">Wins</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-sm text-muted-foreground">Favorite Game</div>
                <div class="text-lg font-medium">{{ stats.favoriteGame }}</div>
              </div>
            </div>
          </div>

          <!-- Online Players -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium flex items-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <span>Players Online</span>
              </h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div *ngFor="let player of onlinePlayers" class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm">{{ player }}</span>
                  </div>
                  <button class="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                    Invite
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Leaderboard -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Top Players</h2>
            </div>
            <div class="p-4">
              <div class="space-y-2">
                <div *ngFor="let player of leaderboard" class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2">
                    <span [class]="'w-6 h-6 rounded-full flex items-center justify-center text-xs ' + getRankColor(player.rank)">
                      {{ player.rank }}
                    </span>
                    <span [class]="player.name === user.name ? 'font-medium' : ''">
                      {{ player.name }}
                    </span>
                  </div>
                  <span class="text-muted-foreground">{{ player.wins }}W</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Components -->
    <app-tic-tac-toe-game 
      *ngIf="activeGame === 'tictactoe'" 
      [user]="user" 
      (back)="backToLobby()"
    ></app-tic-tac-toe-game>

    <app-chess-game 
      *ngIf="activeGame === 'chess'" 
      [user]="user" 
      (back)="backToLobby()"
    ></app-chess-game>
  `
})
export class GameSpaceComponent {
  @Input() user!: User;
  
  activeGame: 'lobby' | 'tictactoe' | 'chess' = 'lobby';

  stats = {
    totalGames: 47,
    wins: 32,
    winRate: Math.round((32 / 47) * 100),
    favoriteGame: 'Chess'
  };

  recentGames = [
    { id: 1, game: 'Chess', opponent: 'Alex Johnson', result: 'Won', duration: '15 min' },
    { id: 2, game: 'Tic-tac-toe', opponent: 'Sarah Kim', result: 'Won', duration: '2 min' },
    { id: 3, game: 'Chess', opponent: 'Mike Chen', result: 'Lost', duration: '23 min' },
    { id: 4, game: 'Tic-tac-toe', opponent: 'Emma Wilson', result: 'Won', duration: '1 min' }
  ];

  onlinePlayers = ['Alex Johnson', 'Sarah Kim', 'Emma Wilson'];

  leaderboard = [
    { name: 'Lisa Garcia', wins: 45, rank: 1 },
    { name: 'Tom Anderson', wins: 42, rank: 2 },
    { name: this.user?.name || 'You', wins: 32, rank: 3 },
    { name: 'Alex Johnson', wins: 28, rank: 4 }
  ];

  startGame(gameType: 'tictactoe' | 'chess') {
    this.activeGame = gameType;
  }

  backToLobby() {
    this.activeGame = 'lobby';
  }

  getRankColor(rank: number): string {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-gray-100 text-gray-800';
      case 3: return 'bg-orange-100 text-orange-800';
      default: return 'bg-muted text-muted-foreground';
    }
  }
}