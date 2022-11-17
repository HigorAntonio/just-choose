import { createContext } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const {
    isLoading,
    isError,
    authentication,
    setAuthentication,
    handleRegistration,
    handleLogin,
    handleLogout,
    refreshProfileData,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isError,
        authentication,
        setAuthentication,
        handleRegistration,
        handleLogin,
        handleLogout,
        refreshProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
