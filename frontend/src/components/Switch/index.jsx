import React from 'react';
import ReactSwitch from 'react-switch';

import { Container } from './styles';

const Switch = (props) => {
  return (
    <Container
      checked={props.checked}
      width={props.width}
      height={props.height}
      offBorder={props.offBorder}
      onBorder={props.onBorder}
      borderRadius={props.borderRadius}
      checkedColor={props.checkedColor}
      uncheckedColor={props.uncheckedColor}
    >
      <ReactSwitch
        {...props}
        width={props.width - 2 * props.borderWidth}
        height={props.height - 2 * props.borderWidth}
      />
    </Container>
  );
};

export default Switch;
