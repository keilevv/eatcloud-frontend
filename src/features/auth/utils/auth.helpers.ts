import { authStorage } from '../services/auth.storage';

export const getAuthHeader = (): Record<string, string> => {
  const token = authStorage.getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
