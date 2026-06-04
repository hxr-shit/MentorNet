import React, { createContext, useContext, useState, useCallback } from "react";
import { Role, User, addUser, getUserByEmail, updateUser } from "@/lib/data";

interface AppContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => User | null;
  signup: (username: string, email: string, password: string, industry: string, role: Role, grade?: string, interests?: string) => User;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "username" | "bio" | "industry" | "interests" | "grade">>) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const login = useCallback((email: string, _password: string) => {
    const user = getUserByEmail(email);
    if (user) { setCurrentUser(user); return user; }
    return null;
  }, []);

  const signup = useCallback((username: string, email: string, _password: string, industry: string, role: Role, grade?: string, interests?: string) => {
    const user = addUser(username, email, role, industry, grade, interests);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const updateProfileFn = useCallback((updates: Partial<Pick<User, "username" | "bio" | "industry" | "interests" | "grade">>) => {
    if (currentUser) {
      const updated = updateUser(currentUser.id, updates);
      if (updated) setCurrentUser({ ...updated });
    }
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      login, signup, logout,
      updateProfile: updateProfileFn,
      refreshKey, triggerRefresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
