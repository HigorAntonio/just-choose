import React, { useEffect, useRef } from 'react';

import contentTypes from '../../utils/contentTypes';
import ContentCardSimple from '../ContentCardSimple';
import ContentCard from '../ContentCard';

import { Container, CardWrapper } from './styles';

const InfinityLoadContentGrid = ({
  loading,
  error,
  content,
  lastElementRef,
  checkbox = false,
  checkboxcheck,
  checkboxclick,
  tabIndex = '0',
}) => {
  const containerRef = useRef();
  const tabIndexRef = useRef(tabIndex);

  useEffect(() => {
    tabIndexRef.current = tabIndex;
  }, [tabIndex]);

  // useEffect responsável por configurar a navegação via teclado
  useEffect(() => {
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
      tabIndex={tabIndexRef.current === '0' ? '-1' : '0'}
      data-content-grid-container
    >
      {!error &&
        content.length > 0 &&
        content.map((c, i) => {
          const cardWrapperProps =
            content.length === i + 1
              ? {
                  key: `content${c.type}${c.content_id}`,
                  ref: lastElementRef,
                }
              : { key: `content${c.type}${c.content_id}` };
          const href = `${contentTypes.getBaseUrl(c.type)}/${
            c.content_platform_id
          }`;
          return (
            <CardWrapper {...cardWrapperProps}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                tabIndex={tabIndex}
                data-focusable
              >
                {checkbox ? (
                  <ContentCard
                    src={contentTypes.getPosterUrl(c)}
                    title={c.title}
                    check={checkboxcheck(c)}
                    click={(e) => checkboxclick(e, c)}
                  />
                ) : (
                  <ContentCardSimple
                    src={contentTypes.getPosterUrl(c)}
                    title={c.title}
                  />
                )}
              </a>
            </CardWrapper>
          );
        })}
    </Container>
  );
};

export default InfinityLoadContentGrid;
