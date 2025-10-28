import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChessGameProps {
  user: { id: string; name: string; email: string };
  onBack: () => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

export function ChessGame({ user, onBack }: ChessGameProps) {
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }); // 10 minutes each
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');

  const opponent = 'Alex Johnson';

  // Initial chess board setup
  const createInitialBoard = (): Board => {
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
  };

  const [board, setBoard] = useState<Board>(createInitialBoard());

  const getPieceSymbol = (piece: Piece | null): string => {
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
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== currentPlayer) return false;
    
    // Basic validation - in a real game, this would include proper chess rules
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    // Simplified move validation for demo purposes
    return true;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || currentPlayer !== 'white') return;

    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (fromRow === row && fromCol === col) {
        // Deselect the same square
        setSelectedSquare(null);
        return;
      }
      
      if (isValidMove(fromRow, fromCol, row, col)) {
        // Make the move
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setSelectedSquare(null);
        setCurrentPlayer('black');
        
        // Simple AI move after a delay
        setTimeout(() => {
          makeAIMove(newBoard);
        }, 1000);
      } else {
        // Invalid move
        setSelectedSquare(null);
        toast.error('Invalid move!');
      }
    } else {
      // Select a square
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const makeAIMove = (currentBoard: Board) => {
    // Very simple AI - just move a random piece
    const blackPieces: [number, number][] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
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
          if (isValidMove(fromRow, fromCol, row, col)) {
            possibleMoves.push([row, col]);
          }
        }
      }
      
      if (possibleMoves.length > 0) {
        const [toRow, toCol] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const newBoard = currentBoard.map(r => [...r]);
        newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setCurrentPlayer('white');
      }
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setGameTime({ white: 600, black: 600 });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Game Space</span>
        </Button>
        <h1 className="text-2xl">Chess</h1>
        <div className="w-32" /> {/* Spacer */}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {opponent.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{opponent}</span>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(gameTime.black)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Black pieces</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded ${currentPlayer === 'black' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {currentPlayer === 'black' ? 'Their Turn' : 'Waiting...'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="grid grid-cols-8 gap-0 border-2 border-border">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        w-16 h-16 flex items-center justify-center text-3xl border border-gray-300
                        ${(rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'}
                        ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex 
                          ? 'ring-4 ring-blue-400' 
                          : 'hover:ring-2 hover:ring-blue-200'
                        }
                        transition-all duration-200
                      `}
                      disabled={gameStatus !== 'playing' || currentPlayer !== 'white'}
                    >
                      {getPieceSymbol(piece)}
                    </button>
                  ))
                )}
              </div>
            </CardContent>
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded ${currentPlayer === 'white' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {currentPlayer === 'white' ? 'Your Turn' : 'Waiting...'}
                </div>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(gameTime.white)}</span>
                      </div>
                      <span>{user.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">White pieces</div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          {/* Game Status */}
          <Card>
            <CardHeader>
              <CardTitle>Game Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-lg mb-2">
                    {gameStatus === 'playing' && 'Game in Progress'}
                    {gameStatus === 'check' && 'Check!'}
                    {gameStatus === 'checkmate' && 'Checkmate!'}
                    {gameStatus === 'draw' && 'Draw'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentPlayer === 'white' ? 'Your turn' : "Opponent's turn"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Move History */}
          <Card>
            <CardHeader>
              <CardTitle>Move History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center">
                Moves will appear here as the game progresses
              </div>
            </CardContent>
          </Card>

          {/* Game Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={resetGame}
                className="w-full flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>New Game</span>
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                Click on a piece to select it, then click on a destination square to move.
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Chess Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Control the center of the board</div>
              <div>• Develop your pieces early</div>
              <div>• Castle your king for safety</div>
              <div>• Think before you move</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}