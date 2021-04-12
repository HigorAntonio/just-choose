import React from 'react';

import ContentCard from '../../components/ContentCard';

import { Container, ContentList } from './styles';

const ContentListPreview = ({ contentType, contentList, setContentList }) => {
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
      {contentList.length > 0 ? (
        <ContentList>
          {contentList.map((c, i) => {
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
        </ContentList>
      ) : (
        <p>Você não adicionou itens à lista</p>
      )}
    </Container>
  );
};

export default ContentListPreview;
