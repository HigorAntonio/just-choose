import React, { useEffect, useRef, useCallback, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCard from '../ContentCard';
import useContentRequest from '../../hooks/useContentRequest';
import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import { Container } from './styles';

const ContentList = ({
  requestType,
  contentType,
  params,
  pageNumber,
  setPageNumber,
  contentList,
  setContentList,
  wrapperRef,
}) => {
  const { title: theme } = useContext(ThemeContext);

  useEffect(() => {
    setPageNumber(1);
  }, [setPageNumber]);

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

  const { content, hasMore, loading } = useContentRequest(
    getUrl(),
    params,
    pageNumber
  );

  // Quando a lista de conteudo muda move o scroll da contentList pro início
  useEffect(() => {
    if (pageNumber === 1) {
      wrapperRef.current.scrollTop = 0;
      wrapperRef.current.scrollLeft = 0;
    }
  }, [pageNumber, wrapperRef]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, setPageNumber]
  );

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
    <Container>
      {content.length > 0 &&
        content.map((c, i) => {
          const src =
            contentType === 'Jogo'
              ? c.background_image
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
      {loading &&
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

export default ContentList;
