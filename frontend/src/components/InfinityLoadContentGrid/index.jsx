import React, { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import contentTypes from '../../utils/contentTypes';
import ContentCardSimple from '../ContentCardSimple';
import ContentCard from '../ContentCard';
import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import { Container, CardWrapper, SkeletonWrapper } from './styles';

const InfinityLoadContentGrid = ({
  isFetching,
  isFetchingNextPage,
  data,
  lastElementRef,
  checkbox = false,
  checkboxcheck,
  checkboxclick,
  tabIndex = '0',
}) => {
  const { title: theme } = useContext(ThemeContext);
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
      {data?.pages.map((page) => {
        return page.results.map((content, i) => {
          const cardWrapperProps =
            page.results.length === i + 1
              ? {
                  key: `content${content.type}${content.content_id}`,
                  ref: lastElementRef,
                }
              : { key: `content${content.type}${content.content_id}` };
          const href = `${contentTypes.getBaseUrl(content.type)}/${
            content.content_platform_id
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
                    src={contentTypes.getPosterUrl(content)}
                    title={content.title}
                    check={checkboxcheck(content)}
                    click={(e) => checkboxclick(e, content)}
                  />
                ) : (
                  <ContentCardSimple
                    src={contentTypes.getPosterUrl(content)}
                    title={content.title}
                  />
                )}
              </a>
            </CardWrapper>
          );
        });
      })}
      {(isFetching || isFetchingNextPage) &&
        [...new Array(30).keys()].map((_, i) => (
          <SkeletonWrapper key={i}>
            <ThemeProvider
              theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}
            >
              <Skeleton
                variant="rect"
                width={'100%'}
                height={'100%'}
                style={{ position: 'absolute', top: '0', left: '0' }}
              />
            </ThemeProvider>
          </SkeletonWrapper>
        ))}
    </Container>
  );
};

export default InfinityLoadContentGrid;
