import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Mock authentication - in a real app, this would connect to a backend
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Demo User',
        email: email
      };

      // Simulate API delay
      setTimeout(() => {
        this.currentUserSubject.next(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        observer.next(userData);
        observer.complete();
      }, 1000);
    });
  }

  signup(name: string, email: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Mock registration
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email
      };

      // Simulate API delay
      setTimeout(() => {
        this.currentUserSubject.next(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        observer.next(userData);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}