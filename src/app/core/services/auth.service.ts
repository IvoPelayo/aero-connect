import { Injectable, computed, signal } from '@angular/core';
import { LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'ac_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  isAuthenticated = computed(() => !!this._token());

  login(credentials: LoginRequest): void {
    const token = btoa(`${credentials.email}:${credentials.pnr}`);
    this._token.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this._token();
  }
}
