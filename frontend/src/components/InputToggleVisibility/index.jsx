import React, { useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import { MdVisibilityOff } from 'react-icons/md';

import { Container, Input, ToggleVisibility } from './styles';

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
            {showPassword ? (
              <MdVisibilityOff
                size={16}
                color="#fff"
                style={{ flexShrink: 0 }}
              />
            ) : (
              <MdVisibility size={16} color="#fff" style={{ flexShrink: 0 }} />
            )}
          </ToggleVisibility>
        </label>
        <input {...props} type={inputType} />
      </Input>
    </Container>
  );
};

export default InputToggleVisibility;
