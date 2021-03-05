import React, { useState } from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container } from './styles';

const CustomOption = (props) => {
  const [check, setCheck] = useState(false);

  return (
    <Container
      onClick={() => {
        setCheck((prevState) => !prevState);
        props.click();
      }}
    >
      <span>{props.children}</span>
      {check ? (
        <ImCheckboxChecked size={15} color="#fff" style={{ flexShrink: 0 }} />
      ) : (
        <ImCheckboxUnchecked size={15} color="#fff" style={{ flexShrink: 0 }} />
      )}
    </Container>
  );
};

export default CustomOption;
