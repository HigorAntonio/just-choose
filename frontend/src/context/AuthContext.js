import { createContext } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const {
    loading,
    userId,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        loading,
        userId,
        authenticated,
        handleRegistration,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
