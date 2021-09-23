import React from 'react';

import { Container, Text } from './styles';

const Tooltip = ({ width, spacing, show, transitionDuration, children }) => {
  return (
    <Container
      width={width}
      spacing={spacing}
      show={show}
      transitionDuration={transitionDuration}
    >
      <Text>{children}</Text>
    </Container>
  );
};

export default Tooltip;
