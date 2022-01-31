import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import FollowingCard from '../FollowingCard';
import Grid from '../Grid';

import { Container, Message } from './styles';

const Following = () => {
  const { id: profileId } = useParams();

  const [params] = useState({});

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen(
      `/users/${profileId}/following`,
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
                      id: p.id,
                      profile_image_url: p.profile_image_url,
                      name: p.name,
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
                    id: p.id,
                    profile_image_url: p.profile_image_url,
                    name: p.name,
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
