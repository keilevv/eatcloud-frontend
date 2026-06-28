import { useAuth } from './useAuth';

export const useLogout = () => {
  const { logout } = useAuth();

  const executeLogout = () => {
    logout();
  };

  return { logout: executeLogout };
};
