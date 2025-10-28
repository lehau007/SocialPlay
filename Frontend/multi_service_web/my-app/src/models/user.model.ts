export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'playing';
  currentGame?: string;
  wins: number;
  mutualFriends: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  friendName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}