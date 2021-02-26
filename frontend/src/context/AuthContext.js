import { createContext } from 'react';

import useAuth from './hooks/useAuth';

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const {
    loading,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        handleRegistration,
        handleLogin,
        handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
