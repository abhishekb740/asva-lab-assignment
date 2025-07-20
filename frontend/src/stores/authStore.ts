import { create } from 'zustand';
import { authService } from '../services/authService';
import { type SignInFormData } from '../utils/validationSchemas';
import { type User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  signIn: (data: SignInFormData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  initializeAuth: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,

  signIn: async (data: SignInFormData) => {
    set({ isLoading: true });
    
    try {
      const { token, user } = await authService.signIn(data);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Sign in failed';
      set({ 
        isLoading: false, 
        isAuthenticated: false,
        user: null,
        token: null
      });
      return { success: false, error: errorMessage };
    }
  },

  signOut: () => {
    authService.signOut();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false
    });
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin' || false;
  },

  initializeAuth: () => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    const isAuthenticated = authService.isAuthenticated();
    
    set({ user, token, isAuthenticated });
  },
})); 
