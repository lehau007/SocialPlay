import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TicTacToeGameProps {
  user: { id: string; name: string; email: string };
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

export function TicTacToeGame({ user, onBack }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const opponent = 'Alex Johnson'; // Mock opponent

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): Player => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isBoardFull = (board: Board): boolean => {
    return board.every(cell => cell !== null);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
      toast.success(`${gameWinner === 'X' ? user.name : opponent} wins!`);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
      toast.info("It's a draw!");
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // Simple AI for opponent
  useEffect(() => {
    if (currentPlayer === 'O' && !gameOver) {
      const timer = setTimeout(() => {
        const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          if (randomMove !== null) {
            handleCellClick(randomMove);
          }
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameOver]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
  };

  const getCellContent = (cell: Player) => {
    if (cell === 'X') return <span className="text-blue-500 text-4xl">×</span>;
    if (cell === 'O') return <span className="text-red-500 text-4xl">○</span>;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Game Space</span>
        </Button>
        <h1 className="text-2xl">Tic-tac-toe</h1>
        <div className="w-32" /> {/* Spacer */}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {gameOver 
                  ? winner 
                    ? `${winner === 'X' ? user.name : opponent} Wins!`
                    : "It's a Draw!"
                  : `${currentPlayer === 'X' ? user.name : opponent}'s Turn`
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="grid grid-cols-3 gap-2 w-80 h-80">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={gameOver || currentPlayer === 'O'}
                    className="w-full h-full bg-muted border-2 border-border rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors disabled:cursor-not-allowed"
                  >
                    {getCellContent(cell)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          {/* Players */}
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${currentPlayer === 'X' ? 'bg-primary/10' : ''}`}>
                <Avatar>
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span>{user.name}</span>
                    <span className="text-blue-500 text-xl">×</span>
                  </div>
                  <div className="text-sm text-muted-foreground">You</div>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${currentPlayer === 'O' ? 'bg-primary/10' : ''}`}>
                <Avatar>
                  <AvatarFallback>
                    {opponent.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span>{opponent}</span>
                    <span className="text-red-500 text-xl">○</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Opponent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score */}
          <Card>
            <CardHeader>
              <CardTitle>Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{user.name}</span>
                  <span>{scores.X}</span>
                </div>
                <div className="flex justify-between">
                  <span>{opponent}</span>
                  <span>{scores.O}</span>
                </div>
                <div className="flex justify-between">
                  <span>Draws</span>
                  <span>{scores.draws}</span>
                </div>
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
              
              {gameOver && (
                <div className="text-center text-sm text-muted-foreground">
                  Game Over! Start a new game to play again.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}