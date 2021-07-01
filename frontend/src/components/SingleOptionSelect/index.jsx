import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

import { Container, FilterDropDown } from './styles';

const SingleOptionSelect = ({
  show,
  setShow,
  width,
  label,
  dropDownAlign,
  children,
  background,
  hover,
}) => {
  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <Container width={width} background={background} hover={hover}>
        <button onClick={() => setShow((prevState) => !prevState)}>
          <div>{label}</div>
          {show ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <FilterDropDown align={dropDownAlign} show={show}>
          {children}
        </FilterDropDown>
      </Container>
    </ClickAwayListener>
  );
};

export default SingleOptionSelect;
