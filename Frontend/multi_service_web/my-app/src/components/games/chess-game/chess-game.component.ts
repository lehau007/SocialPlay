import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { ToastService } from '../../../services/toast.service';

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

@Component({
  selector: 'app-chess-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
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
        <h1 class="text-2xl font-medium">Chess</h1>
        <div class="w-32"></div> <!-- Spacer -->
      </div>

      <div class="grid lg:grid-cols-4 gap-6">
        <!-- Game Board -->
        <div class="lg:col-span-3">
          <div class="bg-card rounded-lg border border-border">
            <!-- Opponent Info -->
            <div class="p-4 border-b border-border">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {{ getInitials(opponent) }}
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">{{ opponent }}</span>
                      <div class="flex items-center space-x-1 text-sm text-muted-foreground">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{{ formatTime(gameTime.black) }}</span>
                      </div>
                    </div>
                    <div class="text-sm text-muted-foreground">Black pieces</div>
                  </div>
                </div>
                <div [class]="'px-3 py-1 rounded text-sm ' + (currentPlayer === 'black' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')">
                  {{ currentPlayer === 'black' ? 'Their Turn' : 'Waiting...' }}
                </div>
              </div>
            </div>

            <!-- Chess Board -->
            <div class="p-6 flex justify-center">
              <div class="grid grid-cols-8 gap-0 border-2 border-border">
                <ng-container *ngFor="let row of board; let rowIndex = index">
                  <button
                    *ngFor="let piece of row; let colIndex = index"
                    (click)="handleSquareClick(rowIndex, colIndex)"
                    [disabled]="gameStatus !== 'playing' || currentPlayer !== 'white'"
                    [class]="'w-16 h-16 flex items-center justify-center text-3xl border border-gray-300 transition-all duration-200 ' + 
                            ((rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800') +
                            (selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex ? ' ring-4 ring-blue-400' : ' hover:ring-2 hover:ring-blue-200')"
                  >
                    {{ getPieceSymbol(piece) }}
                  </button>
                </ng-container>
              </div>
            </div>

            <!-- Player Info -->
            <div class="p-4 border-t border-border">
              <div class="flex items-center justify-between">
                <div [class]="'px-3 py-1 rounded text-sm ' + (currentPlayer === 'white' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')">
                  {{ currentPlayer === 'white' ? 'Your Turn' : 'Waiting...' }}
                </div>
                <div class="flex items-center space-x-3">
                  <div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center space-x-1 text-sm text-muted-foreground">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{{ formatTime(gameTime.white) }}</span>
                      </div>
                      <span class="font-medium">{{ user.name }}</span>
                    </div>
                    <div class="text-sm text-muted-foreground text-right">White pieces</div>
                  </div>
                  <div class="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {{ getInitials(user.name) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Game Info -->
        <div class="space-y-6">
          <!-- Game Status -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Game Status</h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div class="text-center">
                  <div class="text-lg font-medium mb-2">
                    <span *ngIf="gameStatus === 'playing'">Game in Progress</span>
                    <span *ngIf="gameStatus === 'check'">Check!</span>
                    <span *ngIf="gameStatus === 'checkmate'">Checkmate!</span>
                    <span *ngIf="gameStatus === 'draw'">Draw</span>
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ currentPlayer === 'white' ? 'Your turn' : "Opponent's turn" }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Move History -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Move History</h2>
            </div>
            <div class="p-4">
              <div class="text-sm text-muted-foreground text-center">
                Moves will appear here as the game progresses
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
              
              <div class="text-center text-xs text-muted-foreground">
                Click on a piece to select it, then click on a destination square to move.
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-card rounded-lg border border-border">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium">Chess Tips</h2>
            </div>
            <div class="p-4 text-sm space-y-2">
              <div>• Control the center of the board</div>
              <div>• Develop your pieces early</div>
              <div>• Castle your king for safety</div>
              <div>• Think before you move</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChessGameComponent implements OnInit {
  @Input() user!: User;
  @Output() back = new EventEmitter<void>();

  board: Board = [];
  selectedSquare: [number, number] | null = null;
  currentPlayer: PieceColor = 'white';
  gameTime = { white: 600, black: 600 }; // 10 minutes each
  gameStatus: 'playing' | 'check' | 'checkmate' | 'draw' = 'playing';
  opponent = 'Alex Johnson';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.board = this.createInitialBoard();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  goBack() {
    this.back.emit();
  }

  createInitialBoard(): Board {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place black pieces
    board[0] = [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' }
    ];
    
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black' };
    }
    
    // Place white pieces
    for (let i = 0; i < 8; i++) {
      board[6][i] = { type: 'pawn', color: 'white' };
    }
    
    board[7] = [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' }
    ];
    
    return board;
  }

  getPieceSymbol(piece: Piece | null): string {
    if (!piece) return '';
    
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[piece.color][piece.type];
  }

  isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const piece = this.board[fromRow][fromCol];
    if (!piece || piece.color !== this.currentPlayer) return false;
    
    // Basic validation - in a real game, this would include proper chess rules
    const targetPiece = this.board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    // Simplified move validation for demo purposes
    return true;
  }

  handleSquareClick(row: number, col: number) {
    if (this.gameStatus !== 'playing' || this.currentPlayer !== 'white') return;

    if (this.selectedSquare) {
      const [fromRow, fromCol] = this.selectedSquare;
      
      if (fromRow === row && fromCol === col) {
        // Deselect the same square
        this.selectedSquare = null;
        return;
      }
      
      if (this.isValidMove(fromRow, fromCol, row, col)) {
        // Make the move
        this.board[row][col] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        
        this.selectedSquare = null;
        this.currentPlayer = 'black';
        
        // Simple AI move after a delay
        setTimeout(() => {
          this.makeAIMove();
        }, 1000);
      } else {
        // Invalid move
        this.selectedSquare = null;
        this.toastService.error('Invalid move!');
      }
    } else {
      // Select a square
      const piece = this.board[row][col];
      if (piece && piece.color === this.currentPlayer) {
        this.selectedSquare = [row, col];
      }
    }
  }

  makeAIMove() {
    // Very simple AI - just move a random piece
    const blackPieces: [number, number][] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === 'black') {
          blackPieces.push([row, col]);
        }
      }
    }
    
    if (blackPieces.length > 0) {
      const [fromRow, fromCol] = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      
      // Find a random valid move (simplified)
      const possibleMoves: [number, number][] = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (this.isValidMove(fromRow, fromCol, row, col)) {
            possibleMoves.push([row, col]);
          }
        }
      }
      
      if (possibleMoves.length > 0) {
        const [toRow, toCol] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        
        this.currentPlayer = 'white';
      }
    }
  }

  resetGame() {
    this.board = this.createInitialBoard();
    this.selectedSquare = null;
    this.currentPlayer = 'white';
    this.gameStatus = 'playing';
    this.gameTime = { white: 600, black: 600 };
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}