import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TicTacToeGame } from './games/TicTacToeGame';
import { ChessGame } from './games/ChessGame';
import { Trophy, Users, Clock } from 'lucide-react';

interface GameSpaceProps {
  user: { id: string; name: string; email: string };
}

export function GameSpace({ user }: GameSpaceProps) {
  const [activeGame, setActiveGame] = useState<'lobby' | 'tictactoe' | 'chess'>('lobby');

  const stats = {
    totalGames: 47,
    wins: 32,
    winRate: Math.round((32 / 47) * 100),
    favoriteGame: 'Chess'
  };

  const recentGames = [
    { id: 1, game: 'Chess', opponent: 'Alex Johnson', result: 'Won', duration: '15 min' },
    { id: 2, game: 'Tic-tac-toe', opponent: 'Sarah Kim', result: 'Won', duration: '2 min' },
    { id: 3, game: 'Chess', opponent: 'Mike Chen', result: 'Lost', duration: '23 min' },
    { id: 4, game: 'Tic-tac-toe', opponent: 'Emma Wilson', result: 'Won', duration: '1 min' }
  ];

  if (activeGame === 'tictactoe') {
    return <TicTacToeGame user={user} onBack={() => setActiveGame('lobby')} />;
  }

  if (activeGame === 'chess') {
    return <ChessGame user={user} onBack={() => setActiveGame('lobby')} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Game Lobby Header */}
      <div className="text-center">
        <h1 className="text-3xl mb-2">Game Space</h1>
        <p className="text-muted-foreground">Challenge friends and test your skills</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Game Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Games */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Game</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveGame('tictactoe')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <h3 className="mb-2">Tic-tac-toe (Caro)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quick strategy game for fast-paced fun
                  </p>
                  <Button className="w-full">Play Now</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveGame('chess')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="text-2xl">♟️</div>
                  </div>
                  <h3 className="mb-2">Chess</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Classic strategy game for deep thinking
                  </p>
                  <Button className="w-full">Play Now</Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Recent Games */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {game.game === 'Chess' ? '♟️' : '⭕'}
                      </div>
                      <div>
                        <h4 className="text-sm">{game.game} vs {game.opponent}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{game.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      game.result === 'Won' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {game.result}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Player Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Your Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{stats.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl">{stats.totalGames}</div>
                  <div className="text-xs text-muted-foreground">Total Games</div>
                </div>
                <div>
                  <div className="text-xl">{stats.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Favorite Game</div>
                <div className="text-lg">{stats.favoriteGame}</div>
              </div>
            </CardContent>
          </Card>

          {/* Online Players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Players Online</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Alex Johnson', 'Sarah Kim', 'Emma Wilson'].map((player, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{player}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Invite
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Lisa Garcia', wins: 45, rank: 1 },
                  { name: 'Tom Anderson', wins: 42, rank: 2 },
                  { name: user.name, wins: 32, rank: 3 },
                  { name: 'Alex Johnson', wins: 28, rank: 4 }
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {player.rank}
                      </span>
                      <span className={player.name === user.name ? 'font-medium' : ''}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{player.wins}W</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}