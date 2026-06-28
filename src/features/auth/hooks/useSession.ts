import { useAuth } from './useAuth';

export const useSession = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
