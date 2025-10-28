import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface FeedSectionProps {
  user: { id: string; name: string; email: string };
}

export function FeedSection({ user }: FeedSectionProps) {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
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
  ]);

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error('Please write something to post');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: user.name,
      content: newPost,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Post shared successfully!');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3>{user.name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-20 resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handlePost}>
              Share Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>{post.author}</h3>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{post.content}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 ${post.liked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}