import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Search, UserPlus, MessageCircle, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'playing';
  currentGame?: string;
  wins: number;
  mutualFriends: number;
}

interface FriendsSectionProps {
  user: { id: string; name: string; email: string };
}

export function FriendsSection({ user }: FriendsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
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
  ]);

  const [suggestions] = useState([
    { id: '5', name: 'David Brown', mutualFriends: 4, wins: 18 },
    { id: '6', name: 'Lisa Garcia', mutualFriends: 2, wins: 25 },
    { id: '7', name: 'Tom Anderson', mutualFriends: 6, wins: 11 }
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (friendId: string, friendName: string) => {
    toast.success(`Friend request sent to ${friendName}!`);
  };

  const handleMessage = (friendName: string) => {
    toast.info(`Opening chat with ${friendName}...`);
  };

  const handlePlayGame = (friendName: string) => {
    toast.info(`Inviting ${friendName} to play a game...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === 'playing' && friend.currentGame) {
      return `Playing ${friend.currentGame}`;
    }
    return friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Friends List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Friends ({friends.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-white rounded-full`} />
                    </div>
                    <div>
                      <h4>{friend.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(friend)}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {friend.wins} wins
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {friend.mutualFriends} mutual friends
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessage(friend.name)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayGame(friend.name)}
                      disabled={friend.status === 'offline'}
                    >
                      <Gamepad2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Friend Suggestions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Friends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {suggestion.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm">{suggestion.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.mutualFriends} mutual friends
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.wins} wins
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddFriend(suggestion.id, suggestion.name)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Online Friends */}
          <Card>
            <CardHeader>
              <CardTitle>Online Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friends.filter(f => f.status !== 'offline').map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(friend.status)} border border-white rounded-full`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{friend.name}</p>
                      {friend.status === 'playing' && friend.currentGame && (
                        <Badge variant="secondary" className="text-xs">
                          {friend.currentGame}
                        </Badge>
                      )}
                    </div>
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