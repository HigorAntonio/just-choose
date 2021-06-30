import React from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container } from './styles';

const CustomOption = ({ click, children, check }) => {
  return (
    <Container
      onClick={() => {
        click();
      }}
    >
      <span>{children}</span>
      {check ? (
        <ImCheckboxChecked size={15} style={{ flexShrink: 0 }} />
      ) : (
        <ImCheckboxUnchecked size={15} style={{ flexShrink: 0 }} />
      )}
    </Container>
  );
};

export default CustomOption;
