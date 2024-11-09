import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  impersonateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize default super admin if no users exist
    const users = localStorage.getItem('users');
    if (!users) {
      const initialSuperAdmin: User = {
        id: '1',
        email: "admin@example.com",
        name: "Super Admin",
        role: "SUPER_ADMIN",
        password: "admin123",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([initialSuperAdmin]));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedOriginalUser = localStorage.getItem('originalUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      if (savedOriginalUser) {
        setOriginalUser(JSON.parse(savedOriginalUser));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => 
      u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    return foundUser;
  };

  const impersonateUser = async (userToImpersonate: User): Promise<void> => {
    // Sauvegarder l'utilisateur original si ce n'est pas déjà fait
    if (!originalUser) {
      setOriginalUser(user);
      localStorage.setItem('originalUser', JSON.stringify(user));
    }
    
    // Connecter en tant que nouvel utilisateur
    setUser(userToImpersonate);
    localStorage.setItem('currentUser', JSON.stringify(userToImpersonate));
  };

  const logout = () => {
    // Si on a un utilisateur original, revenir à celui-ci
    if (originalUser) {
      setUser(originalUser);
      localStorage.setItem('currentUser', JSON.stringify(originalUser));
      setOriginalUser(null);
      localStorage.removeItem('originalUser');
    } else {
      // Sinon, déconnexion complète
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('originalUser');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, impersonateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};