import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import UserProfileFollowingCard from '../UserProfileFollowingCard';
import UserProfileGrid from '../UserProfileGrid';

import { Container, Message } from './styles';

const UserProfileFollowing = () => {
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
        <UserProfileGrid minWidth="21rem" gridGap="2rem">
          {content.map((p, i) => {
            if (content.length === i + 1) {
              return (
                <div key={p.user_id} ref={lastElementRef}>
                  <UserProfileFollowingCard
                    profile={{
                      id: p.user_id,
                      profile_image_url: p.profile_image_url,
                      name: p.user_name,
                      followers_count: p.followers_count,
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={p.user_id}>
                <UserProfileFollowingCard
                  profile={{
                    id: p.user_id,
                    profile_image_url: p.profile_image_url,
                    name: p.user_name,
                    followers_count: p.followers_count,
                  }}
                />
              </div>
            );
          })}
        </UserProfileGrid>
      )}
    </Container>
  );
};

export default UserProfileFollowing;
