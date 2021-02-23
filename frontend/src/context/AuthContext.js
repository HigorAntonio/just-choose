import { createContext } from 'react';

import useAuth from './hooks/useAuth';

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const { loading, authenticated, handleLogin } = useAuth();

  return (
    <AuthContext.Provider value={{ loading, authenticated, handleLogin }}>
      {props.children}
    </AuthContext.Provider>
  );
};
