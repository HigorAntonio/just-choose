import React, { useState } from 'react';

import {
  Container,
  Input,
  VisibleIcon,
  InvisibleIcon,
  ToggleVisibility,
} from './styles';

const InputToggleVisibility = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState('password');

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
    setInputType((prevState) =>
      prevState === 'password' ? 'text' : 'password'
    );
  };

  return (
    <Container>
      <Input>
        <label htmlFor={props.id}>
          {props.label}
          <ToggleVisibility
            onClick={handleTogglePassword}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPassword ? <InvisibleIcon /> : <VisibleIcon />}
          </ToggleVisibility>
        </label>
        <input {...props} type={inputType} />
      </Input>
    </Container>
  );
};

export default InputToggleVisibility;
