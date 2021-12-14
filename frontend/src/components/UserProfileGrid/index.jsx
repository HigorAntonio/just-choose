import React, { useEffect, useRef } from 'react';

import { Container } from './styles';

const UserProfileGrid = ({ minWidth, gridGap, tabIndex = '0', children }) => {
  const containerRef = useRef();
  const tabIndexRef = useRef(tabIndex);

  useEffect(() => {
    tabIndexRef.current = tabIndex;
  }, [tabIndex]);

  useEffect(() => {
    [...containerRef.current.querySelectorAll('[data-focusable]')].forEach(
      (element) => element.setAttribute('tabindex', tabIndexRef.current)
    );

    if (tabIndexRef.current === '-1') {
      const handleKeydown = (e) => {
        if (document.hasFocus()) {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
          }
          if (
            document.activeElement.hasAttribute('data-content-grid-container')
          ) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              if (
                document.activeElement
                  .closest('[data-content-grid-container]')
                  .querySelectorAll('[data-focusable]')[0]
              ) {
                document.activeElement
                  .closest('[data-content-grid-container]')
                  .querySelectorAll('[data-focusable]')[0]
                  .focus();
              }
            }
          } else if (
            document.activeElement.closest('[data-content-grid-container]') !=
            null
          ) {
            let activeElementIndex = [
              ...document.activeElement
                .closest('[data-content-grid-container]')
                .querySelectorAll('[data-focusable]'),
            ].indexOf(document.activeElement);
            if (e.key === 'ArrowRight') {
              if (
                ++activeElementIndex <
                [
                  ...document.activeElement
                    .closest('[data-content-grid-container]')
                    .querySelectorAll('[data-focusable]'),
                ].length
              ) {
                [
                  ...document.activeElement
                    .closest('[data-content-grid-container]')
                    .querySelectorAll('[data-focusable]'),
                ][activeElementIndex].focus();
              }
            }
            if (e.key === 'ArrowLeft') {
              if (--activeElementIndex >= 0) {
                [
                  ...document.activeElement
                    .closest('[data-content-grid-container]')
                    .querySelectorAll('[data-focusable]'),
                ][activeElementIndex].focus();
              }
            }
          }
        }
      };

      containerRef.current.addEventListener('keydown', handleKeydown);
    }
  }, []);

  return (
    <Container
      ref={containerRef}
      minWidth={minWidth}
      gridGap={gridGap}
      tabIndex={tabIndexRef.current === '0' ? '-1' : '0'}
      data-content-grid-container
    >
      {children}
    </Container>
  );
};

export default UserProfileGrid;
