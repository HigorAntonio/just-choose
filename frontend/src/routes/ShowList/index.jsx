import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import justChooseApi from '../../apis/justChooseApi';
import ContentCardSimple from '../../components/ContentCardSimple';

import {
  Container,
  Header,
  ListInfo,
  Description,
  Main,
  ContentListContainer,
} from './styles';

const getMonth = (month) => {
  switch (month) {
    case 0:
      return 'janeiro';
    case 1:
      return 'fevereiro';
    case 2:
      return 'março';
    case 3:
      return 'abril';
    case 4:
      return 'maio';
    case 5:
      return 'junho';
    case 6:
      return 'julho';
    case 7:
      return 'agosto';
    case 8:
      return 'setembro';
    case 9:
      return 'outubro';
    case 10:
      return 'novembro';
    case 11:
      return 'dezembro';
    default:
      return '-';
  }
};

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

const ShowList = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [contentList, setContentList] = useState({});
  const [createdAt, setCreatedAt] = useState();
  const [contentTypes, setContentTypes] = useState([]);
  const [content, setContent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await justChooseApi.get(`/contentlists/${id}`);
        setContentList(data);
        setCreatedAt(new Date(data.created_at));
        setContentTypes(data.content_types);
        data.content_types.map((t) =>
          setContent((prevState) => [...prevState, ...data.content[`${t}s`]])
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [id]);

  // useEffect(() => console.debug('loading:', loading), [loading]);
  // useEffect(() => console.debug('contentList:', contentList), [contentList]);
  // useEffect(() => console.debug('content:', content), [content]);

  return (
    <Container>
      <Header>
        <h1>{contentList.title}</h1>
        <ListInfo>
          Criada em{' '}
          <span className="created-at">
            {createdAt
              ? `${createdAt.getDate()}  de ${getMonth(
                  createdAt.getMonth()
                )} de ${createdAt.getFullYear()}`
              : '-'}
          </span>{' '}
          por <span className="created-by">{contentList.user_name}</span>
        </ListInfo>
        <Description>
          {contentList.description}
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quas
          numquam ea vel vero quod illo ipsa dolore doloremque quidem!
          Repudiandae quo sed minus praesentium autem soluta non enim iure
          dolores in impedit natus expedita dolorem incidunt aspernatur delectus
          ad obcaecati quod explicabo deleniti nostrum, voluptatibus illo saepe.
          Est, hic? */}
        </Description>
      </Header>
      <Main>
        {contentList.content && (
          <ContentListContainer>
            {content.length > 0 &&
              content.map((c, i) => {
                const src =
                  c.type === 'game'
                    ? c.poster_path
                    : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
                const href = `${getContentBaseUrl(c.type)}/${
                  c.content_platform_id
                }`;
                return (
                  <div key={c.type + c.content_id} className="cardWrapper">
                    <a href={href} target="blank">
                      <ContentCardSimple src={src} title={c.title} />
                    </a>
                  </div>
                );
              })}
          </ContentListContainer>
        )}
      </Main>
    </Container>
  );
};

export default ShowList;
