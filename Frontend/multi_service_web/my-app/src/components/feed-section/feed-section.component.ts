import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Post } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-feed-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Create Post -->
      <div class="bg-card rounded-lg border border-border">
        <div class="p-4 border-b border-border">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {{ getInitials(user.name) }}
            </div>
            <div>
              <h3 class="font-medium">{{ user.name }}</h3>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <textarea
            [(ngModel)]="newPost"
            placeholder="What's on your mind?"
            class="w-full min-h-20 p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
          <div class="flex justify-end">
            <button
              (click)="createPost()"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Share Post
            </button>
          </div>
        </div>
      </div>

      <!-- Posts Feed -->
      <div class="space-y-4">
        <div *ngFor="let post of posts" class="bg-card rounded-lg border border-border">
          <div class="p-4 border-b border-border">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {{ getInitials(post.author) }}
              </div>
              <div>
                <h3 class="font-medium">{{ post.author }}</h3>
                <p class="text-sm text-muted-foreground">{{ post.timestamp }}</p>
              </div>
            </div>
          </div>
          <div class="p-4 space-y-4">
            <p>{{ post.content }}</p>
            
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <div class="flex items-center space-x-6">
                <button
                  (click)="toggleLike(post)"
                  [class]="'flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ' + (post.liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50')"
                >
                  <svg class="h-4 w-4" [class.fill-current]="post.liked" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span>{{ post.likes }}</span>
                </button>
                
                <button class="flex items-center space-x-2 px-3 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>{{ post.comments }}</span>
                </button>
                
                <button class="flex items-center space-x-2 px-3 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeedSectionComponent implements OnInit {
  @Input() user!: User;
  
  newPost = '';
  posts: Post[] = [
    {
      id: '1',
      author: 'Alex Johnson',
      content: 'Just finished an amazing chess match! The endgame was incredibly tense. Looking forward to the next challenge! ♟️',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      liked: false
    },
    {
      id: '2',
      author: 'Sarah Kim',
      content: 'Love the new tic-tac-toe tournaments! Great way to warm up before the chess matches. Who wants to play? 🎯',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 5,
      liked: true
    },
    {
      id: '3',
      author: 'Mike Chen',
      content: 'Thanks to everyone who participated in today\'s gaming session. The community here is amazing! See you all tomorrow for more games.',
      timestamp: '1 day ago',
      likes: 25,
      comments: 8,
      liked: false
    }
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit() {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  createPost() {
    if (!this.newPost.trim()) {
      this.toastService.error('Please write something to post');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: this.user.name,
      content: this.newPost,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      liked: false
    };

    this.posts.unshift(post);
    this.newPost = '';
    this.toastService.success('Post shared successfully!');
  }

  toggleLike(post: Post) {
    post.liked = !post.liked;
    post.likes = post.liked ? post.likes + 1 : post.likes - 1;
  }
}