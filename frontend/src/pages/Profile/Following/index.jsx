import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import FollowingCard from '../FollowingCard';
import Grid from '../Grid';

import { Container, Message } from './styles';

const Following = ({ profileToShowId }) => {
  const [params] = useState({});

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen(
      `/profiles/${profileToShowId}/following`,
      params
    );

  return (
    <Container>
      {!loading && content.length === 0 && (
        <Message>Este perfil não apresenta outros perfis.</Message>
      )}
      {content.length > 0 && (
        <Grid minWidth="21rem" gridGap="2rem">
          {content.map((p, i) => {
            if (content.length === i + 1) {
              return (
                <div key={p.id} ref={lastElementRef}>
                  <FollowingCard
                    profile={{
                      name: p.name,
                      display_name: p.display_name,
                      profile_image_url: p.profile_image_url,
                      followers_count: p.followers_count,
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={p.id}>
                <FollowingCard
                  profile={{
                    name: p.name,
                    display_name: p.display_name,
                    profile_image_url: p.profile_image_url,
                    followers_count: p.followers_count,
                  }}
                />
              </div>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Following;
