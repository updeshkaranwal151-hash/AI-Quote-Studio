import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mock';

interface AuthContextType {
  currentUser: User | null;
  users: Record<string, User>;
  login: (name: string) => void;
  updateUser: (userId: string, updatedData: Partial<Pick<User, 'name' | 'bio'>>) => void;
  deleteUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>(() => {
    try {
      const storedUsers = window.localStorage.getItem('users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
      return MOCK_USERS;
    } catch (error) {
      console.error("Error loading users from localStorage", error);
      return MOCK_USERS;
    }
  });

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading currentUser from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to localStorage", error);
    }
  }, [users]);
  
  const login = (name: string) => {
    if (!name.trim()) return;

    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: name.trim(),
      avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=${name.trim().replace(/\s/g, '')}`,
      bio: '',
      createdAt: Date.now()
    };

    setCurrentUser(newUser);
    setUsers(prevUsers => ({ ...prevUsers, [userId]: newUser }));

    try {
      window.localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving currentUser to localStorage", error);
    }
  };

  const updateUser = (userId: string, updatedData: Partial<Pick<User, 'name' | 'bio'>>) => {
    setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        if (newUsers[userId]) {
            newUsers[userId] = { ...newUsers[userId], ...updatedData };
        }
        return newUsers;
    });

    if (currentUser?.id === userId) {
        const updatedCurrentUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedCurrentUser);
        try {
            window.localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        } catch (error) {
            console.error("Error saving currentUser to localStorage", error);
        }
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        delete newUsers[userId];
        return newUsers;
    });

    if (currentUser?.id === userId) {
        setCurrentUser(null);
        try {
            window.localStorage.removeItem('currentUser');
        } catch (error) {
            console.error("Error removing currentUser from localStorage", error);
        }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};