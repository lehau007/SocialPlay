import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  friendName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface MessagesSectionProps {
  user: { id: string; name: string; email: string };
}

export function MessagesSection({ user }: MessagesSectionProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      friendName: 'Alex Johnson',
      lastMessage: 'Great game! Want to play another round?',
      timestamp: '5 min ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      friendName: 'Sarah Kim',
      lastMessage: 'Thanks for the chess tips!',
      timestamp: '1 hour ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      friendName: 'Mike Chen',
      lastMessage: 'See you tomorrow for the tournament',
      timestamp: '2 hours ago',
      unread: 1,
      online: false
    },
    {
      id: '4',
      friendName: 'Emma Wilson',
      lastMessage: 'That was an amazing comeback!',
      timestamp: '1 day ago',
      unread: 0,
      online: true
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: 'alex',
        senderName: 'Alex Johnson',
        content: 'Hey! Ready for our chess match?',
        timestamp: '10:30 AM'
      },
      {
        id: '2',
        senderId: user.id,
        senderName: user.name,
        content: 'Absolutely! Let me finish this current game.',
        timestamp: '10:32 AM'
      },
      {
        id: '3',
        senderId: 'alex',
        senderName: 'Alex Johnson',
        content: 'Great game! Want to play another round?',
        timestamp: '11:15 AM'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: 'sarah',
        senderName: 'Sarah Kim',
        content: 'Your chess strategy was brilliant today!',
        timestamp: '9:00 AM'
      },
      {
        id: '2',
        senderId: user.id,
        senderName: user.name,
        content: 'Thank you! I\'ve been practicing that opening.',
        timestamp: '9:05 AM'
      },
      {
        id: '3',
        senderId: 'sarah',
        senderName: 'Sarah Kim',
        content: 'Thanks for the chess tips!',
        timestamp: '9:10 AM'
      }
    ]
  });

  const filteredConversations = conversations.filter(conv =>
    conv.friendName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    setNewMessage('');
  };

  const selectedMessages = selectedConversation ? messages[selectedConversation] || [] : [];
  const selectedFriend = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="space-y-1 p-4">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>
                            {conversation.friendName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm truncate">{conversation.friendName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs opacity-70">{conversation.timestamp}</span>
                            {conversation.unread > 0 && (
                              <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs opacity-70 truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedFriend ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>
                          {selectedFriend.friendName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedFriend.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3>{selectedFriend.friendName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedFriend.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {selectedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === user.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <h3>Select a conversation</h3>
                  <p>Choose a friend to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}