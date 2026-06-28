import { createContext } from 'react';

import { AuthState, LoginCredentials } from '../types/auth.types';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
