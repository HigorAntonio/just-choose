import React, { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCardSimple from '../../components/ContentCardSimple';
import ContentCard from '../../components/ContentCard';

import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import { Container, CardWrapper } from './styles';

const getContentBaseUrl = (type) => {
  switch (type) {
    case 'movie':
      return process.env.REACT_APP_TMDB_MOVIE_URL;
    case 'show':
      return process.env.REACT_APP_TMDB_SHOW_URL;
    case 'game':
      return process.env.REACT_APP_RAWG_GAME_URL;
    default:
      return '';
  }
};

const ContentGrid = ({
  content,
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
      tabIndex={tabIndexRef.current === '0' ? '-1' : '0'}
      data-content-grid-container
    >
      {content.length > 0 &&
        content.map((c) => {
          const src =
            c.type === 'game'
              ? c.poster_path &&
                c.poster_path.replace(
                  'https://media.rawg.io/media',
                  'https://media.rawg.io/media/resize/420/-'
                )
              : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
          const href = `${getContentBaseUrl(c.type)}/${c.content_platform_id}`;
          return (
            <CardWrapper key={c.type + c.content_id}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                tabIndex="-1"
                data-focusable
              >
                {checkbox ? (
                  <ContentCard
                    src={src}
                    title={c.title}
                    check={checkboxcheck(c)}
                    click={(e) => checkboxclick(e, c)}
                  />
                ) : (
                  <ContentCardSimple src={src} title={c.title} />
                )}
              </a>
            </CardWrapper>
          );
        })}
      {content.length <= 0 &&
        [...Array(30).keys()].map((c) => (
          <CardWrapper key={c}>
            <ThemeProvider
              theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}
            >
              <Skeleton variant="rect" width={'100%'} height={'100%'} />
            </ThemeProvider>
          </CardWrapper>
        ))}
    </Container>
  );
};

export default ContentGrid;
