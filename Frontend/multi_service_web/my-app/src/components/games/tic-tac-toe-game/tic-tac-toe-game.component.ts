import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { ToastService } from '../../../services/toast.service';

type Player = 'X' | 'O' | null;
type Board = Player[];

@Component({
  selector: 'app-tic-tac-toe-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button 
          (click)="goBack()"
          class="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Back to Game Space</span>
        </button>
        <h1 class="text-2xl font-medium">Tic-tac-toe</h1>
        <div class="w-32"></div> <!-- Spacer -->
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Game Board -->
        <div class="lg:col-span-2">
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border text-center">
              <h2 class="text-lg font-medium">
                <span *ngIf="gameOver && winner">{{ winner === 'X' ? user.name : opponent }} Wins!</span>
                <span *ngIf="gameOver && !winner">It's a Draw!</span>
                <span *ngIf="!gameOver">{{ currentPlayer === 'X' ? user.name : opponent }}'s Turn</span>
              </h2>
            </div>
            <div class="p-6 flex justify-center">
              <div class="grid grid-cols-3 gap-2 w-80 h-80">
                <button
                  *ngFor="let cell of board; let i = index"
                  (click)="handleCellClick(i)"
                  [disabled]="gameOver || currentPlayer === 'O'"
                  class="w-full h-full bg-muted border-2 border-border rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors disabled:cursor-not-allowed text-4xl"
                >
                  <span *ngIf="cell === 'X'" class="text-blue-500">×</span>
                  <span *ngIf="cell === 'O'" class="text-red-500">○</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Game Info -->
        <div class="space-y-6">
          <!-- Players -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Players</h2>
            </div>
            <div class="p-4 space-y-4">
              <div [class]="'flex items-center space-x-3 p-3 rounded-lg ' + (currentPlayer === 'X' ? 'bg-primary/10' : '')">
                <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {{ getInitials(user.name) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium">{{ user.name }}</span>
                    <span class="text-blue-500 text-xl">×</span>
                  </div>
                  <div class="text-sm text-muted-foreground">You</div>
                </div>
              </div>

              <div [class]="'flex items-center space-x-3 p-3 rounded-lg ' + (currentPlayer === 'O' ? 'bg-primary/10' : '')">
                <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {{ getInitials(opponent) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium">{{ opponent }}</span>
                    <span class="text-red-500 text-xl">○</span>
                  </div>
                  <div class="text-sm text-muted-foreground">Opponent</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Score -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Score</h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span>{{ user.name }}</span>
                  <span>{{ scores.X }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ opponent }}</span>
                  <span>{{ scores.O }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Draws</span>
                  <span>{{ scores.draws }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Game Controls -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Game Controls</h2>
            </div>
            <div class="p-4 space-y-3">
              <button 
                (click)="resetGame()"
                class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>New Game</span>
              </button>
              
              <div *ngIf="gameOver" class="text-center text-sm text-muted-foreground">
                Game Over! Start a new game to play again.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TicTacToeGameComponent implements OnInit {
  @Input() user!: User;
  @Output() back = new EventEmitter<void>();

  board: Board = Array(9).fill(null);
  currentPlayer: 'X' | 'O' = 'X';
  winner: Player = null;
  gameOver = false;
  scores = { X: 0, O: 0, draws: 0 };
  opponent = 'Alex Johnson';

  winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit() {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  goBack() {
    this.back.emit();
  }

  checkWinner(board: Board): Player {
    for (const combo of this.winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  isBoardFull(board: Board): boolean {
    return board.every(cell => cell !== null);
  }

  handleCellClick(index: number) {
    if (this.board[index] || this.gameOver) return;

    this.board[index] = this.currentPlayer;

    const gameWinner = this.checkWinner(this.board);
    if (gameWinner) {
      this.winner = gameWinner;
      this.gameOver = true;
      this.scores[gameWinner]++;
      this.toastService.success(`${gameWinner === 'X' ? this.user.name : this.opponent} wins!`);
    } else if (this.isBoardFull(this.board)) {
      this.gameOver = true;
      this.scores.draws++;
      this.toastService.info("It's a draw!");
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      
      // Simple AI move after a delay
      if (this.currentPlayer === 'O' && !this.gameOver) {
        setTimeout(() => {
          this.makeAIMove();
        }, 1000);
      }
    }
  }

  makeAIMove() {
    const availableMoves = this.board
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];
    
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      this.handleCellClick(randomMove);
    }
  }

  resetGame() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.gameOver = false;
  }
}