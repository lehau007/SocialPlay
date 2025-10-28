import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Message, Conversation } from '../../models/user.model';

@Component({
  selector: 'app-messages-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="grid lg:grid-cols-3 gap-6 h-[600px]">
        <!-- Conversations List -->
        <div class="lg:col-span-1">
          <div class="bg-card rounded-lg border border-border h-full flex flex-col">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-medium mb-4">Messages</h2>
              <div class="relative">
                <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  [(ngModel)]="searchQuery"
                  placeholder="Search conversations..."
                  class="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div class="space-y-1 p-4">
                <div
                  *ngFor="let conversation of filteredConversations"
                  (click)="selectConversation(conversation.id)"
                  [class]="'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ' + (selectedConversation === conversation.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')"
                >
                  <div class="relative">
                    <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(conversation.friendName) }}
                    </div>
                    <div *ngIf="conversation.online" class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-medium truncate">{{ conversation.friendName }}</h4>
                      <div class="flex items-center space-x-2">
                        <span class="text-xs opacity-70">{{ conversation.timestamp }}</span>
                        <div *ngIf="conversation.unread > 0" class="h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                          {{ conversation.unread }}
                        </div>
                      </div>
                    </div>
                    <p class="text-xs opacity-70 truncate">{{ conversation.lastMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="lg:col-span-2">
          <div class="bg-card rounded-lg border border-border h-full flex flex-col">
            <div *ngIf="selectedFriend; else noConversation">
              <!-- Chat Header -->
              <div class="p-4 border-b border-border">
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(selectedFriend.friendName) }}
                    </div>
                    <div *ngIf="selectedFriend.online" class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 class="font-medium">{{ selectedFriend.friendName }}</h3>
                    <p class="text-sm text-muted-foreground">
                      {{ selectedFriend.online ? 'Online' : 'Offline' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Messages -->
              <div class="flex-1 overflow-y-auto p-4">
                <div class="space-y-4">
                  <div
                    *ngFor="let message of selectedMessages"
                    [class]="'flex ' + (message.senderId === user.id ? 'justify-end' : 'justify-start')"
                  >
                    <div
                      [class]="'max-w-xs lg:max-w-md px-4 py-2 rounded-lg ' + (message.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted')"
                    >
                      <p class="text-sm">{{ message.content }}</p>
                      <p
                        [class]="'text-xs mt-1 ' + (message.senderId === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground')"
                      >
                        {{ message.timestamp }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message Input -->
              <div class="p-4 border-t border-border">
                <div class="flex space-x-2">
                  <input
                    [(ngModel)]="newMessage"
                    (keyup.enter)="sendMessage()"
                    placeholder="Type a message..."
                    class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    (click)="sendMessage()"
                    [disabled]="!newMessage.trim()"
                    class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <ng-template #noConversation>
              <div class="flex-1 flex items-center justify-center">
                <div class="text-center text-muted-foreground">
                  <h3 class="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a friend to start messaging</p>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MessagesSectionComponent implements OnInit {
  @Input() user!: User;
  
  selectedConversation: string | null = '1';
  newMessage = '';
  searchQuery = '';

  conversations: Conversation[] = [
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
  ];

  messages: Record<string, Message[]> = {
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
        senderId: this.user?.id || '',
        senderName: this.user?.name || '',
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
        senderId: this.user?.id || '',
        senderName: this.user?.name || '',
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
  };

  constructor() {}

  ngOnInit() {
    // Update message sender info after user is available
    if (this.user) {
      Object.values(this.messages).forEach(messageList => {
        messageList.forEach(message => {
          if (message.senderId === '') {
            message.senderId = this.user.id;
            message.senderName = this.user.name;
          }
        });
      });
    }
  }

  get filteredConversations(): Conversation[] {
    return this.conversations.filter(conv =>
      conv.friendName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get selectedMessages(): Message[] {
    return this.selectedConversation ? this.messages[this.selectedConversation] || [] : [];
  }

  get selectedFriend(): Conversation | null {
    return this.conversations.find(c => c.id === this.selectedConversation) || null;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  selectConversation(conversationId: string) {
    this.selectedConversation = conversationId;
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: this.user.id,
      senderName: this.user.name,
      content: this.newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!this.messages[this.selectedConversation]) {
      this.messages[this.selectedConversation] = [];
    }

    this.messages[this.selectedConversation].push(message);
    this.newMessage = '';
  }
}