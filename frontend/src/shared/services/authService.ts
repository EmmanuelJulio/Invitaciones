import { apiClient } from '../../api/client';
import type { AuthResponse } from '../types/api';

export class AuthService {
  static async login(password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      password,
    });
    return response.data;
  }

  static async validateToken(): Promise<{ valid: boolean; user?: { isAdmin: boolean } }> {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  }

  static saveToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  static removeToken(): void {
    localStorage.removeItem('adminToken');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}