import api from './api';
import { type SignInFormData } from '../utils/validationSchemas';
import { type User, type AuthResponse, type LoginRequest, type RegisterRequest } from '../types/user';

export const authService = {
  async signIn(data: SignInFormData): Promise<{ token: string; user: User }> {
    const loginData: LoginRequest = {
      email: data.email,
      password: data.password
    };
    
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  async signUp(data: RegisterRequest): Promise<{ token: string; user: User }> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/profile');
    return response.data.user;
  },

  signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
}; 
