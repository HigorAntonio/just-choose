import React from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container, Logo } from './styles';

const ContentProvider = ({ click, children, check, ...rest }) => {
  return (
    <Container
      onClick={() => {
        click();
      }}
      {...rest}
    >
      <div>
        <Logo src={children} />
        <span>{children}</span>
      </div>
      {check ? (
        <ImCheckboxChecked size={'1.5rem'} style={{ flexShrink: 0 }} />
      ) : (
        <ImCheckboxUnchecked size={'1.5rem'} style={{ flexShrink: 0 }} />
      )}
    </Container>
  );
};

export default ContentProvider;
