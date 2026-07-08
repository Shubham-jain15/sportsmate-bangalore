import React, { createContext, useState, useContext, useCallback } from 'react';
import { USERS, MY_PROFILE } from '../data/users';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [likedIds, setLikedIds]       = useState([]);
  const [joinedSessions, setJoined]   = useState([]);

  const login = useCallback((email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      return { success: true };
    }
    if (email && password.length >= 6) {
      setUser({ ...MY_PROFILE, email });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null); setMatchedUsers([]); setLikedIds([]); setJoined([]);
  }, []);

  const likeUser = useCallback((target) => {
    setLikedIds(prev => [...prev, target.id]);
    if (Math.random() > 0.4) {
      setMatchedUsers(prev => [...prev, target]);
      return true;
    }
    return false;
  }, []);

  const joinSession = useCallback((sessionId) => {
    setJoined(prev => prev.includes(sessionId) ? prev : [...prev, sessionId]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, matchedUsers, likedIds, likeUser, joinedSessions, joinSession }}>
      {children}
    </AuthContext.Provider>
  );
};
