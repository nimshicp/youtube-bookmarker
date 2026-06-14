import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );

  // Define logout BEFORE useEffect so the closure captures it correctly
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: ['user'] });
  }, [queryClient]);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 mins — prevents false logouts
  });

  useEffect(() => {
    if (error) {
      // Token is invalid or expired — clear session
      logout();
    }
  }, [error, logout]);

  const login = useCallback((accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
    queryClient.setQueryData(['user'], userData);
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
