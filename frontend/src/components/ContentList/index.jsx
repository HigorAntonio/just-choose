import React, { useEffect, useContext, useRef, memo } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import contentTypes from '../../utils/contentTypes';
import ContentCard from '../ContentCard';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';
import contentTypesUtility from '../../utils/contentTypes';

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
    wrapperRef.current.scrollTo(0, 0);
  }, [wrapperRef, requestType, params]);

  const getPosterPathByContentType = (content) => {
    if (contentType === 'Filme') {
      return content.poster_path ? content.poster_path : '';
    }
    if (contentType === 'Série') {
      return content.poster_path ? content.poster_path : '';
    }
    if (contentType === 'Jogo') {
      return content.background_image ? content.background_image : '';
    }
    return '';
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) {
      return '';
    }
    if (contentType === 'Jogo') {
      return posterPath.replace(
        'https://media.rawg.io/media',
        'https://media.rawg.io/media/resize/420/-'
      );
    }
    if (contentType === 'Filme' || contentType === 'Série') {
      return `${process.env.REACT_APP_TMDB_POSTER_URL}w185${posterPath}`;
    }
    return '';
  };

  const addToContentList = (content) => {
    const { contentPlatformId, title, posterPath } = content;
    if (
      contentList.map((c) => c.content_platform_id).includes(contentPlatformId)
    ) {
      setContentList((prevState) =>
        prevState.filter((c) => c.content_platform_id !== contentPlatformId)
      );
    } else {
      setContentList((prevState) => [
        ...prevState,
        {
          content_platform_id: contentPlatformId,
          title,
          poster_path: posterPath,
          type: contentTypesUtility.options.find((e) => e.key === contentType)
            .value,
        },
      ]);
    }
  };

  const isInContentList = (contentPlatformId) =>
    contentList.map((c) => c.content_platform_id).includes(contentPlatformId);

  return (
    <Container ref={containerRef} tabIndex="0" data-content-list-container>
      {!showPreview &&
        content.length > 0 &&
        content.map((c, i) => {
          const title = contentType === 'Filme' ? c.title : c.name;
          const cardWrapperProps =
            content.length === i + 1 ? { ref: lastElementRef } : {};
          return (
            <div key={c.id} className="cardWrapper" {...cardWrapperProps}>
              <ContentCard
                src={getPosterUrl(getPosterPathByContentType(c))}
                title={title}
                click={() =>
                  addToContentList({
                    contentPlatformId: c.id,
                    title: title,
                    posterPath: getPosterPathByContentType(c),
                  })
                }
                check={isInContentList(c.id)}
              />
            </div>
          );
        })}
      {showPreview &&
        contentList.length > 0 &&
        contentList.map((c, i) => {
          return (
            <div key={c.content_platform_id} className="cardWrapper">
              <ContentCard
                src={contentTypes.getPosterUrl(c)}
                title={c.title}
                click={() =>
                  addToContentList({
                    contentPlatformId: c.content_platform_id,
                    title: c.title,
                    posterPath: c.poster_path,
                  })
                }
                check={isInContentList(c.content_platform_id)}
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
