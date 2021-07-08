import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCardSimple from '../../components/ContentCardSimple';
import ContentCard from '../../components/ContentCard';

import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import { Container } from './styles';

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
}) => {
  const { title: theme } = useContext(ThemeContext);

  return (
    <Container>
      {content.length > 0 &&
        content.map((c) => {
          const src =
            c.type === 'game'
              ? c.poster_path
              : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
          const href = `${getContentBaseUrl(c.type)}/${c.content_platform_id}`;
          return (
            <div key={c.type + c.content_id} className="cardWrapper">
              <a href={href} target="_blank" rel="noreferrer">
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
            </div>
          );
        })}
      {content.length <= 0 &&
        [...Array(30).keys()].map((c) => (
          <div key={c} className="cardWrapper">
            <ThemeProvider
              theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}
            >
              <Skeleton variant="rect" width={'100%'} height={'100%'} />
            </ThemeProvider>
          </div>
        ))}
    </Container>
  );
};

export default ContentGrid;
