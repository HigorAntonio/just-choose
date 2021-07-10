import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

import { Container, FilterDropDown } from './styles';

const CustomSelect = ({ label, dropDownAlign, children }) => {
  const [show, setShow] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <Container>
        <button onClick={() => setShow((prevState) => !prevState)}>
          {label}
          {show ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <FilterDropDown align={dropDownAlign} show={show}>
          {children}
        </FilterDropDown>
      </Container>
    </ClickAwayListener>
  );
};

export default CustomSelect;
