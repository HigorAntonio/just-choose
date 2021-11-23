import React, { useEffect, useCallback, useRef } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

import { Container, SelectMenu } from './styles';

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
  const selectRef = useRef();
  const showRef = useRef(show);

  useEffect(() => (showRef.current = show), [show]);

  const handleKeydown = useCallback(
    (e) => {
      if (document.hasFocus()) {
        if (e.key === 'Escape') {
          setShow(false);
          document.activeElement
            .closest('[data-select]')
            .querySelector('[data-select-button]')
            .focus();
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && showRef.current) {
          e.preventDefault();
        }
        if (
          document.activeElement.hasAttribute('data-select-button') &&
          showRef.current
        ) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (
              document.activeElement
                .closest('[data-select]')
                .querySelectorAll('[data-select-option]')[0]
            ) {
              document.activeElement
                .closest('[data-select]')
                .querySelectorAll('[data-select-option]')[0]
                .focus();
            }
          }
        } else if (
          document.activeElement.closest('[data-select]') != null &&
          showRef.current
        ) {
          let activeElementIndex = [
            ...document.activeElement
              .closest('[data-select]')
              .querySelectorAll('[data-select-option]'),
          ].indexOf(document.activeElement);
          if (e.key === 'ArrowDown') {
            if (
              ++activeElementIndex <
              [
                ...document.activeElement
                  .closest('[data-select]')
                  .querySelectorAll('[data-select-option]'),
              ].length
            ) {
              [
                ...document.activeElement
                  .closest('[data-select]')
                  .querySelectorAll('[data-select-option]'),
              ][activeElementIndex].focus();
            }
          }
          if (e.key === 'ArrowUp') {
            if (--activeElementIndex >= 0) {
              [
                ...document.activeElement
                  .closest('[data-select]')
                  .querySelectorAll('[data-select-option]'),
              ][activeElementIndex].focus();
            }
          }
        }
      }
    },
    [setShow]
  );

  useEffect(() => {
    selectRef.current.addEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <Container
        width={width}
        background={background}
        hover={hover}
        ref={selectRef}
        data-select
      >
        <button
          onClick={() => setShow((prevState) => !prevState)}
          data-select-button
        >
          <div>{label}</div>
          {show ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <SelectMenu align={dropDownAlign} show={show} data-select-menu>
          {children}
        </SelectMenu>
      </Container>
    </ClickAwayListener>
  );
};

export default SingleOptionSelect;
