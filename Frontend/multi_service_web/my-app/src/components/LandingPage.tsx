import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AuthModal } from './AuthModal';
import { Users, MessageSquare, Gamepad2, Heart, Trophy, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onLogin: (userData: { id: string; name: string; email: string }) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuth = (type: 'login' | 'signup') => {
    setAuthMode(type);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Connect with Friends",
      description: "Build meaningful connections and expand your social network with ease."
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Real-time Messaging",
      description: "Chat instantly with friends and stay connected wherever you are."
    },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Game Space",
      description: "Challenge friends to classic games like Tic-tac-toe and Chess."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Share Moments",
      description: "Post updates, photos, and thoughts to share with your community."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Compete & Win",
      description: "Track your gaming achievements and climb the leaderboards."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Enjoy seamless performance and instant interactions."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl">SocialPlay</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => handleAuth('login')}>
                Login
              </Button>
              <Button onClick={() => handleAuth('signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl mb-6">
                Connect, Play, and Share with Friends
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join the ultimate social platform where friendship meets gaming. Chat with friends, 
                share your moments, and challenge each other in classic games.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" onClick={() => handleAuth('signup')}>
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleAuth('login')}>
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758520388212-04b4d36e1364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGNvbm5lY3Rpb24lMjBmcmllbmRzaGlwfGVufDF8fHx8MTc1ODg5MDc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="People connecting and having fun"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              Discover all the amazing features that make SocialPlay special
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662169847892-565cce8f901c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGVzcyUyMGJvYXJkJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzU4ODkwNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Chess and strategy games"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl mb-6">
                Challenge Your Mind
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Test your strategic thinking with classic games. Play Tic-tac-toe for quick fun 
                or dive deep into Chess matches with friends. Track your wins and improve your skills.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Real-time multiplayer gaming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Skill-based matchmaking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Achievement system and leaderboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6">
            Ready to Join the Fun?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with friends, share your stories, and enjoy endless gaming entertainment.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => handleAuth('signup')}
            className="text-lg px-8 py-3"
          >
            Start Playing Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl">SocialPlay</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 SocialPlay. Connect, Play, Share.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onLogin={onLogin}
      />
    </div>
  );
}