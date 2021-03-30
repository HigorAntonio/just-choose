import React from 'react';

import ContentCard from '../../components/ContentCard';

import { Container } from './styles';

const ContentListMovies = ({ movies, contentList, setContentList }) => {
  const addMovieToContentList = (contentId, posterPath, title) => {
    if (contentList.map((c) => c.contentId).includes(contentId)) {
      setContentList((prevState) =>
        prevState.filter((c) => c.contentId !== contentId)
      );
    } else {
      setContentList((prevState) => [
        ...prevState,
        {
          type: 'movie',
          contentId,
          poster: `${process.env.REACT_APP_TMDB_POSTER_URL}w185${posterPath}`,
          title,
        },
      ]);
    }
  };

  const isMovieInContentList = (contentId) =>
    movies.map((m) => m.contentId).includes(contentId);

  return (
    <Container>
      {movies.length > 0 &&
        movies.map((c, i) => {
          return (
            <div key={c.id} className="cardWrapper">
              <ContentCard
                src={`${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`}
                title={c.title}
                click={() =>
                  addMovieToContentList(c.id, c.poster_path, c.title)
                }
                check={isMovieInContentList(c.id)}
              />
            </div>
          );
        })}
    </Container>
  );
};

export default ContentListMovies;
