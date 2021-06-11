import React, { useContext } from 'react';

import { AlertContext } from '../../context/AlertContext';

import { Container } from './styles';

const Alert = () => {
  const { message, severity, show } = useContext(AlertContext);

  return (
    <Container show={show} severity={severity}>
      {message}
    </Container>
  );
};

export default Alert;
