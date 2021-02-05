import React from 'react';

import { Container } from './styles';

const Backdrop = ({ show, clicked }) => {
  return show ? <Container onClick={clicked}></Container> : null;
};

export default Backdrop;
