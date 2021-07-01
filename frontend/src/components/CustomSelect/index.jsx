import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

import { Container, FilterDropDown } from './styles';

const CustomSelect = (props) => {
  const [show, setShow] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <Container>
        <button onClick={() => setShow((prevState) => !prevState)}>
          {props.label}
          {show ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <FilterDropDown align={props.dropDownAlign} show={show}>
          {props.children}
        </FilterDropDown>
      </Container>
    </ClickAwayListener>
  );
};

export default CustomSelect;
