import React, { useState } from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container, Logo } from './styles';

const ContentProvider = (props) => {
  const [check, setCheck] = useState(false);

  return (
    <Container
      onClick={() => {
        setCheck((prevState) => !prevState);
      }}
    >
      <div>
        <Logo src={props.children} />
        <span>{props.children}</span>
      </div>
      {check ? (
        <ImCheckboxChecked size={15} color="#fff" />
      ) : (
        <ImCheckboxUnchecked size={15} color="#fff" />
      )}
    </Container>
  );
};

export default ContentProvider;
