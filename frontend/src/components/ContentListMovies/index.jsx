import React, { useEffect, useRef, useCallback } from 'react';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCard from '../../components/ContentCard';
import useMovieRequest from '../../hooks/useMovieRequest';
import theme from '../../styles/materialUITheme';

import { Container } from './styles';

const ContentListMovie = ({
  params,
  pageNumber,
  setPageNumber,
  contentList,
  setContentList,
}) => {
  useEffect(() => {
    setPageNumber(1);
  }, [setPageNumber]);

  const { movies, hasMore, loading } = useMovieRequest(params, pageNumber);

  const observer = useRef();
  const lastMovieElementRef = useCallback(
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

  const addMovieToContentList = (contentId) => {
    if (contentList.map((c) => c.contentId).includes(contentId)) {
      setContentList((prevState) =>
        prevState.filter((c) => c.contentId !== contentId)
      );
    } else {
      setContentList((prevState) => [
        ...prevState,
        { type: 'movie', contentId },
      ]);
    }
  };

  const isMovieInContentList = (contentId) =>
    contentList.map((c) => c.contentId).includes(contentId);

  return (
    <Container>
      {movies.length > 0 &&
        movies.map((c, i) => {
          if (movies.length === i + 1) {
            return (
              <div ref={lastMovieElementRef} key={c.id} className="cardWrapper">
                <ContentCard
                  src={`${process.env.REACT_APP_TMDB_POSTER_URL}w342${c.poster_path}`}
                  click={() => addMovieToContentList(c.id)}
                  check={isMovieInContentList(c.id)}
                />
              </div>
            );
          }
          return (
            <div key={c.id} className="cardWrapper">
              <ContentCard
                src={`${process.env.REACT_APP_TMDB_POSTER_URL}w342${c.poster_path}`}
                click={() => addMovieToContentList(c.id)}
                check={isMovieInContentList(c.id)}
              />
            </div>
          );
        })}
      {loading &&
        [...new Array(30).keys()].map((_, i) => (
          <div key={i} className="skeleton">
            <ThemeProvider theme={theme}>
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

export default ContentListMovie;
