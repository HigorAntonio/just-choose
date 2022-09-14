import { createContext } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const {
    loading,
    profileId,
    profileName,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        loading,
        profileId,
        profileName,
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
