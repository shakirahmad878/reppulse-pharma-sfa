import { UserProfile } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { CURRENT_USER_MOCK } from '../constants/mockData';

export class AuthService {
  private static currentUser: UserProfile | null = null;

  public static async restoreSession(): Promise<UserProfile | null> {
    const session = await StorageService.getItem<UserProfile | null>(STORAGE_KEYS.AUTH_SESSION, null);
    this.currentUser = session;
    return session;
  }

  public static getCurrentUser(): UserProfile | null {
    return this.currentUser || CURRENT_USER_MOCK;
  }

  public static async login(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const user: UserProfile = {
      ...CURRENT_USER_MOCK,
      email: email.trim().toLowerCase(),
      token: 'jwt_live_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7),
    };

    await StorageService.setItem(STORAGE_KEYS.AUTH_SESSION, user);
    this.currentUser = user;
    return { success: true, user };
  }

  public static async logout(): Promise<void> {
    this.currentUser = null;
    await StorageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}
