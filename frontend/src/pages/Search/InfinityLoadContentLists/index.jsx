import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';

import NotFound from '../NotFound';
import ContentListCard from '../ContentListCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadContentLists = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'content_list' });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/search', params);

  return (
    <>
      {!loading && content.length === 0 && <NotFound query={query} />}
      {!error && content.length > 0 && (
        <Container>
          <Header>
            <Title>Listas</Title>
          </Header>
          <Main>
            {content.map((contentList, i) =>
              content.length === i + 1 ? (
                <div key={`contentList${contentList.id}`} ref={lastElementRef}>
                  <ContentListCard contentList={contentList} />
                </div>
              ) : (
                <div key={`contentList${contentList.id}`}>
                  <ContentListCard contentList={contentList} />
                </div>
              )
            )}
          </Main>
        </Container>
      )}
    </>
  );
};

export default InfinityLoadContentLists;
