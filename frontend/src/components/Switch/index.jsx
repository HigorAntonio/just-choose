import React from 'react';
import ReactSwitch from 'react-switch';

import { Container } from './styles';

const Switch = (props) => {
  return (
    <Container
      checked={props.checked}
      width={props.width}
      height={props.height}
      offborder={props.offborder}
      border={props.border}
      borderRadius={props.borderRadius}
      checkedcolor={props.checkedcolor}
      uncheckedcolor={props.uncheckedcolor}
    >
      <ReactSwitch
        {...props}
        width={props.width - 2 * props.borderwidth}
        height={props.height - 2 * props.borderwidth}
      />
    </Container>
  );
};

export default Switch;
