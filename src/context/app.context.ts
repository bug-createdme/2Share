import { createContext } from 'react';

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_path?: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  profile: null,
  setProfile: () => {},
});
