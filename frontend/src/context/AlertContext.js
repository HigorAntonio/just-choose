import React, { useState, createContext } from 'react';

export const AlertContext = createContext();

export const AlertContextProvider = (props) => {
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState();

  return (
    <AlertContext.Provider
      value={{
        severity,
        setSeverity,
        message,
        setMessage,
        show,
        setShow,
        duration,
        setDuration,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
