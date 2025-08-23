import { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        setLoading(true);
        
        const token = AuthService.getToken();
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const result = await AuthService.validateToken();
        setIsAuthenticated(result.valid);
      } catch (error) {
        console.error('Error validating auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (password: string): Promise<void> => {
    const authResponse = await AuthService.login(password);
    AuthService.saveToken(authResponse.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.removeToken();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
  };
};