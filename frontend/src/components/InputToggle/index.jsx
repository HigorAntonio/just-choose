import React, { useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import { MdVisibilityOff } from 'react-icons/md';

import { Container, Input, ToggleVisibility } from './styles';

const InputToggle = (props) => {
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
          <ToggleVisibility
            onClick={handleTogglePassword}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPassword ? (
              <MdVisibilityOff size={16} style={{ flexShrink: 0 }} />
            ) : (
              <MdVisibility size={16} style={{ flexShrink: 0 }} />
            )}
          </ToggleVisibility>
        </label>
        <input {...props} type={inputType} />
      </Input>
    </Container>
  );
};

export default InputToggle;
