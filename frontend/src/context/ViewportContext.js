import React, { createContext } from 'react';
import { useWindowWidth } from '@react-hook/window-size/throttled';

export const ViewportContext = createContext();

export const ViewportContextProvider = ({ children }) => {
  const width = useWindowWidth();

  return (
    <ViewportContext.Provider value={{ width }}>
      {children}
    </ViewportContext.Provider>
  );
};
