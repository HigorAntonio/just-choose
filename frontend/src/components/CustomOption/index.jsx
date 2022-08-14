import React from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container } from './styles';

const CustomOption = ({ click, children, check, ...rest }) => {
  return (
    <Container
      onClick={() => {
        click();
      }}
      {...rest}
    >
      <span>{children}</span>
      {check ? (
        <ImCheckboxChecked size={'1.5rem'} style={{ flexShrink: 0 }} />
      ) : (
        <ImCheckboxUnchecked size={'1.5rem'} style={{ flexShrink: 0 }} />
      )}
    </Container>
  );
};

export default CustomOption;
