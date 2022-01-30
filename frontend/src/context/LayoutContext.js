import React, { useRef, createContext } from 'react';

export const LayoutContext = createContext();

export const LayoutContextProvider = ({ children }) => {
  const contentWrapperRef = useRef();

  return (
    <LayoutContext.Provider
      value={{
        contentWrapperRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
