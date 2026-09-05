import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

const CURRENT_USER_KEY = 'pharma_sfa_current_user';

export class AuthService {
  static getCurrentUser(): User {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    // Default to Super Admin for immediate management testing
    return INITIAL_USERS[0];
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static switchRole(role: UserRole): User {
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    this.setCurrentUser(user);
    return user;
  }

  static isSuperAdmin(user?: User): boolean {
    const u = user || this.getCurrentUser();
    return u.role === 'SUPER_ADMIN';
  }

  static canAccessTelemetry(user?: User): boolean {
    const u = user || this.getCurrentUser();
    // STRICT RULE: Only SUPER_ADMIN can inspect live employee telemetry and location tracks
    return u.role === 'SUPER_ADMIN';
  }

  static canManageMasterData(user?: User): boolean {
    const u = user || this.getCurrentUser();
    return u.role === 'SUPER_ADMIN' || u.role === 'AREA_MANAGER' || u.role === 'REGIONAL_MANAGER';
  }
}
