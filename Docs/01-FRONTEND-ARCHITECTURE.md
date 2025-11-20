# Frontend Architecture - SocialPlay

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [State Management](#state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Component Library](#component-library)
8. [API Integration](#api-integration)
9. [Real-time Features](#real-time-features)
10. [Performance Optimization](#performance-optimization)
11. [Security Implementation](#security-implementation)
12. [Testing Strategy](#testing-strategy)

---

## Overview

The frontend is a modern, responsive single-page application (SPA) built with React and TypeScript, designed for optimal user experience across all devices.

### Key Features
- ✅ Server-Side Rendering (SSR) with Next.js
- ✅ Progressive Web App (PWA) capabilities
- ✅ Real-time updates via WebSocket
- ✅ Optimistic UI updates
- ✅ Offline support
- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme support
- ✅ Internationalization (i18n)

---

## Technology Stack

```yaml
Core:
  Framework: Next.js 14+ (React 18+)
  Language: TypeScript 5+
  Build Tool: Turbopack/Webpack

State Management:
  Global State: Zustand / Redux Toolkit
  Server State: TanStack Query (React Query)
  Form State: React Hook Form

Styling:
  CSS Framework: Tailwind CSS 3+
  Component Library: shadcn/ui or Material-UI
  CSS-in-JS: Styled Components (optional)
  Animations: Framer Motion

Data Fetching:
  HTTP Client: Axios
  React Query: TanStack Query v5
  GraphQL: Apollo Client (optional)

Real-time:
  WebSocket: Socket.io-client
  Server-Sent Events: EventSource API

Validation:
  Schema: Zod
  Form Validation: React Hook Form + Zod

Routing:
  App Router: Next.js App Router
  
Authentication:
  JWT: jose library
  OAuth: NextAuth.js

Testing:
  Unit: Jest + React Testing Library
  E2E: Playwright / Cypress
  Visual: Chromatic / Percy

Development:
  Linting: ESLint
  Formatting: Prettier
  Pre-commit: Husky + lint-staged
  Type Checking: TypeScript strict mode

Monitoring:
  Error Tracking: Sentry
  Analytics: Google Analytics, Mixpanel
  Performance: Web Vitals, Lighthouse
```

---

## Project Structure

```
Frontend/
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── feed/
│   │   │   ├── profile/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/               # API routes
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── error.tsx          # Error boundary
│   │   ├── loading.tsx        # Loading state
│   │   └── not-found.tsx      # 404 page
│   │
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.stories.tsx
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── Navigation/
│   │   │
│   │   ├── features/         # Feature-specific components
│   │   │   ├── Post/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostCreate.tsx
│   │   │   │   └── PostActions.tsx
│   │   │   ├── Comment/
│   │   │   ├── Profile/
│   │   │   ├── Message/
│   │   │   └── Notification/
│   │   │
│   │   └── shared/           # Shared components
│   │       ├── ErrorBoundary/
│   │       ├── LoadingSpinner/
│   │       ├── InfiniteScroll/
│   │       └── ImageUpload/
│   │
│   ├── lib/                  # Core utilities
│   │   ├── api/             # API client
│   │   │   ├── axios.ts
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   │
│   │   ├── auth/            # Authentication
│   │   │   ├── jwt.ts
│   │   │   ├── session.ts
│   │   │   └── providers.ts
│   │   │
│   │   ├── socket/          # WebSocket client
│   │   │   ├── socket.ts
│   │   │   └── events.ts
│   │   │
│   │   └── utils/           # Helper functions
│   │       ├── format.ts
│   │       ├── validation.ts
│   │       └── constants.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersection.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useSocket.ts
│   │   └── index.ts
│   │
│   ├── store/               # State management
│   │   ├── slices/         # Redux slices or Zustand stores
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── postSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── index.ts
│   │
│   ├── services/            # API service layer
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── postService.ts
│   │   ├── commentService.ts
│   │   ├── messageService.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   ├── Comment.ts
│   │   │   └── Message.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── schemas/             # Validation schemas
│   │   ├── authSchemas.ts
│   │   ├── postSchemas.ts
│   │   └── userSchemas.ts
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   └── config/              # Configuration files
│       ├── env.ts
│       ├── constants.ts
│       └── routes.ts
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local              # Environment variables
├── .env.production
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest configuration
├── playwright.config.ts    # Playwright configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
└── package.json           # Dependencies
```

---

## Architecture Patterns

### 1. **Component Architecture**

```typescript
// Atomic Design Pattern
components/
  ui/           → Atoms (Button, Input, Icon)
  layout/       → Molecules (SearchBar, UserCard)
  features/     → Organisms (PostList, ChatWindow)
  app/          → Templates & Pages
```

### 2. **Smart vs Presentational Components**

```typescript
// Presentational Component (Dumb)
interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => onLike(post.id)}>Like</button>
      <button onClick={() => onComment(post.id)}>Comment</button>
    </div>
  );
};

// Smart Component (Container)
export const PostCardContainer: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: post } = useQuery(['post', postId], () => fetchPost(postId));
  const likeMutation = useMutation(likePost);
  
  const handleLike = (id: string) => {
    likeMutation.mutate(id);
  };
  
  return <PostCard post={post} onLike={handleLike} onComment={() => {}} />;
};
```

### 3. **Compound Components Pattern**

```typescript
// components/ui/Dropdown/Dropdown.tsx
export const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="dropdown">{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.Trigger = ({ children }) => {
  const { setIsOpen } = useDropdownContext();
  return <button onClick={() => setIsOpen(prev => !prev)}>{children}</button>;
};

Dropdown.Menu = ({ children }) => {
  const { isOpen } = useDropdownContext();
  return isOpen ? <div className="menu">{children}</div> : null;
};

// Usage
<Dropdown>
  <Dropdown.Trigger>Menu</Dropdown.Trigger>
  <Dropdown.Menu>
    <MenuItem>Profile</MenuItem>
    <MenuItem>Settings</MenuItem>
  </Dropdown.Menu>
</Dropdown>
```

---

## State Management

### 1. **Zustand Store (Recommended)**

```typescript
// store/slices/authSlice.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const response = await authService.login(email, password);
        set({ 
          user: response.user, 
          token: response.token,
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
      
      refreshToken: async () => {
        const response = await authService.refresh();
        set({ token: response.token });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);
```

### 2. **Server State with React Query**

```typescript
// services/postService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch posts with pagination
export const usePosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => api.get(`/posts?page=${page}&limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostDto) => api.post('/posts', data),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    // Optimistic update
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      
      queryClient.setQueryData(['posts'], (old: any) => ({
        ...old,
        data: [newPost, ...old.data]
      }));
      
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    }
  });
};

// Like post mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => api.post(`/posts/${postId}/like`),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    }
  });
};
```

### 3. **UI State Management**

```typescript
// store/slices/uiSlice.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notificationCount: number;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setNotificationCount: (count: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  notificationCount: 0,
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  setNotificationCount: (count) => set({ notificationCount: count })
}));
```

---

## Routing & Navigation

### Next.js App Router Structure

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/(dashboard)/feed/page.tsx
export default function FeedPage() {
  return <FeedContainer />;
}

// Middleware for protected routes
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/messages/:path*']
};
```

### Dynamic Routes

```typescript
// app/profile/[userId]/page.tsx
export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await fetchUser(params.userId);
  return <ProfileView user={user} />;
}

// app/post/[postId]/page.tsx
export default async function PostDetailPage({ params }: { params: { postId: string } }) {
  const post = await fetchPost(params.postId);
  return <PostDetail post={post} />;
}
```

---

## Component Library

### Base UI Components

```typescript
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-300 hover:bg-gray-100',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);
```

### Form Components

```typescript
// components/ui/Input/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

// Usage with React Hook Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/authSchemas';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

---

## API Integration

### Axios Configuration

```typescript
// lib/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/slices/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Token expired - try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### API Service Layer

```typescript
// services/authService.ts
import { api } from '@/lib/api/axios';

export const authService = {
  login: async (email: string, password: string) => {
    return await api.post('/auth/login', { email, password });
  },
  
  register: async (data: RegisterDto) => {
    return await api.post('/auth/register', data);
  },
  
  logout: async () => {
    return await api.post('/auth/logout');
  },
  
  refresh: async () => {
    return await api.post('/auth/refresh');
  },
  
  forgotPassword: async (email: string) => {
    return await api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (token: string, password: string) => {
    return await api.post('/auth/reset-password', { token, password });
  }
};

// services/postService.ts
export const postService = {
  getPosts: async (page: number = 1, limit: number = 10) => {
    return await api.get(`/posts?page=${page}&limit=${limit}`);
  },
  
  getPost: async (id: string) => {
    return await api.get(`/posts/${id}`);
  },
  
  createPost: async (data: CreatePostDto) => {
    return await api.post('/posts', data);
  },
  
  updatePost: async (id: string, data: UpdatePostDto) => {
    return await api.put(`/posts/${id}`, data);
  },
  
  deletePost: async (id: string) => {
    return await api.delete(`/posts/${id}`);
  },
  
  likePost: async (id: string) => {
    return await api.post(`/posts/${id}/like`);
  },
  
  unlikePost: async (id: string) => {
    return await api.delete(`/posts/${id}/like`);
  }
};
```

---

## Real-time Features

### WebSocket Integration

```typescript
// lib/socket/socket.ts
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/slices/authSlice';

class SocketClient {
  private socket: Socket | null = null;
  
  connect() {
    const token = useAuthStore.getState().token;
    
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    return this.socket;
  }
  
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
  
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
  
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }
  
  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketClient = new SocketClient();

// hooks/useSocket.ts
import { useEffect } from 'react';
import { socketClient } from '@/lib/socket/socket';

export const useSocket = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    socketClient.on(event, callback);
    
    return () => {
      socketClient.off(event, callback);
    };
  }, [event, callback]);
};

// Usage in component
export function NotificationBell() {
  const [count, setCount] = useState(0);
  
  useSocket('notification', (data) => {
    setCount(prev => prev + 1);
    toast.success(data.message);
  });
  
  return <Badge count={count}>🔔</Badge>;
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy loading components
import dynamic from 'next/dynamic';

const PostEditor = dynamic(() => import('@/components/features/Post/PostEditor'), {
  loading: () => <Skeleton />,
  ssr: false
});

const HeavyChart = dynamic(() => import('@/components/Charts/HeavyChart'), {
  loading: () => <div>Loading chart...</div>
});
```

### Image Optimization

```typescript
// Using Next.js Image component
import Image from 'next/image';

export function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      loading="lazy"
      placeholder="blur"
      blurDataURL="/placeholder-avatar.jpg"
    />
  );
}
```

### Infinite Scroll

```typescript
// components/shared/InfiniteScroll/InfiniteScroll.tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

export function PostList() {
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => postService.getPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    }
  });
  
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  
  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((post) => <PostCard key={post.id} post={post} />)
      )}
      
      <div ref={ref}>
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  );
}
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive component
export const PostCard = memo(({ post, onLike }: PostCardProps) => {
  // Component logic
});

// Memoize expensive calculation
export function UserStats({ userId }: { userId: string }) {
  const stats = useMemo(() => {
    return calculateUserStats(userId); // Expensive operation
  }, [userId]);
  
  return <div>{stats}</div>;
}

// Memoize callback
export function ParentComponent() {
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []); // Won't recreate on every render
  
  return <ChildComponent onClick={handleClick} />;
}
```

---

## Security Implementation

### XSS Prevention

```typescript
// Use DOMPurify for sanitizing HTML
import DOMPurify from 'dompurify';

export function SafeHTML({ html }: { html: string }) {
  const sanitized = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
      ALLOWED_ATTR: ['href']
    });
  }, [html]);
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### CSRF Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const csrfToken = request.cookies.get('csrf-token')?.value;
  const headerToken = request.headers.get('X-CSRF-Token');
  
  if (request.method !== 'GET' && csrfToken !== headerToken) {
    return new NextResponse('Invalid CSRF token', { status: 403 });
  }
  
  return NextResponse.next();
}
```

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.socialplay.com wss://api.socialplay.com;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};
```

---

## Testing Strategy

### Unit Testing

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Testing

```typescript
// tests/integration/auth.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/features/Auth/LoginForm';

describe('Login Flow', () => {
  it('successfully logs in user', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing (Playwright)

```typescript
// tests/e2e/post-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a post', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  
  // Wait for redirect to feed
  await expect(page).toHaveURL('/feed');
  
  // Create post
  await page.click('button:has-text("Create Post")');
  await page.fill('[name=content]', 'This is my test post');
  await page.click('button:has-text("Publish")');
  
  // Verify post appears
  await expect(page.locator('text=This is my test post')).toBeVisible();
});
```

---

## Build & Deployment

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3000
NEXT_PUBLIC_CDN_URL=https://cdn.socialplay.com
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Build Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: ['cdn.socialplay.com', 's3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Docker Configuration

```dockerfile
# Frontend/Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001
ENV PORT 3001

CMD ["node", "server.js"]
```

---

**Next Document**: [Main Service Architecture](./02-MAIN-SERVICE-ARCHITECTURE.md)
