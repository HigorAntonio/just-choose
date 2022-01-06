import React, { useEffect, useContext, useRef, memo } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCard from '../ContentCard';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import { Container, Message } from './styles';

const ContentList = ({
  requestType,
  contentType,
  params,
  contentList = {},
  setContentList,
  showPreview,
  wrapperRef,
  showSkeleton = true,
}) => {
  const { title: theme } = useContext(ThemeContext);
  const containerRef = useRef();

  useEffect(() => {
    const handleKeydown = (e) => {
      if (document.hasFocus()) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
        }
        if (
          document.activeElement.hasAttribute('data-content-list-container')
        ) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (
              document.activeElement
                .closest('[data-content-list-container]')
                .querySelectorAll('[data-focusable]')[0]
            ) {
              document.activeElement
                .closest('[data-content-list-container]')
                .querySelectorAll('[data-focusable]')[0]
                .focus();
            }
          }
        } else if (
          document.activeElement.closest('[data-content-list-container]') !=
          null
        ) {
          let activeElementIndex = [
            ...document.activeElement
              .closest('[data-content-list-container]')
              .querySelectorAll('[data-focusable]'),
          ].indexOf(document.activeElement);
          if (e.key === 'ArrowRight') {
            if (
              ++activeElementIndex <
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ].length
            ) {
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ][activeElementIndex].focus();
            }
          }
          if (e.key === 'ArrowLeft') {
            if (--activeElementIndex >= 0) {
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ][activeElementIndex].focus();
            }
          }
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleKeydown);
  }, []);

  const getUrl = () => {
    if (requestType === 'movie') {
      return '/movies';
    }
    if (requestType === 'movie-search') {
      return '/movies/search';
    }
    if (requestType === 'show') {
      return '/shows';
    }
    if (requestType === 'show-search') {
      return '/shows/search';
    }
    if (requestType === 'game') {
      return '/games';
    }
  };

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen(getUrl(), params);

  // Quando a lista de conteudo muda move o scroll da contentList pro início
  useEffect(() => {
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef, requestType, params]);

  const addToContentList = (contentId, posterPath, title) => {
    if (contentList.map((c) => c.contentId).includes(contentId)) {
      setContentList((prevState) =>
        prevState.filter((c) => c.contentId !== contentId)
      );
    } else {
      setContentList((prevState) => [
        ...prevState,
        {
          type:
            contentType === 'Filme'
              ? 'movie'
              : contentType === 'Série'
              ? 'show'
              : 'game',
          contentId,
          poster: posterPath,
          title,
        },
      ]);
    }
  };

  const isInContentList = (contentId) =>
    contentList.map((c) => c.contentId).includes(contentId);

  return (
    <Container ref={containerRef} tabIndex="0" data-content-list-container>
      {!showPreview &&
        content.length > 0 &&
        content.map((c, i) => {
          const src =
            contentType === 'Jogo'
              ? c.background_image &&
                c.background_image.replace(
                  'https://media.rawg.io/media',
                  'https://media.rawg.io/media/resize/420/-'
                )
              : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
          const title = contentType === 'Filme' ? c.title : c.name;
          if (content.length === i + 1) {
            return (
              <div ref={lastElementRef} key={c.id} className="cardWrapper">
                <ContentCard
                  src={src}
                  title={title}
                  click={() => addToContentList(c.id, src, title)}
                  check={isInContentList(c.id)}
                />
              </div>
            );
          }
          return (
            <div key={c.id} className="cardWrapper">
              <ContentCard
                src={src}
                title={title}
                click={() => addToContentList(c.id, src, title)}
                check={isInContentList(c.id)}
              />
            </div>
          );
        })}
      {showPreview &&
        contentList.length > 0 &&
        contentList.map((c) => {
          return (
            <div key={c.contentId} className="cardWrapper">
              <ContentCard
                src={c.poster}
                title={c.title}
                click={() => addToContentList(c.contentId, c.poster, c.title)}
                check={isInContentList(c.contentId)}
              />
            </div>
          );
        })}
      {showPreview && !contentList.length && (
        <Message>Você não adicionou itens à lista</Message>
      )}
      {showSkeleton &&
        loading &&
        [...new Array(30).keys()].map((_, i) => (
          <div key={i} className="skeleton">
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
          </div>
        ))}
    </Container>
  );
};

export default memo(ContentList);
