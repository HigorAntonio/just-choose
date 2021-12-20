import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import UserProfilePollCard from '../UserProfilePollCard';
import UserProfileGrid from '../UserProfileGrid';

import { Container } from './styles';

const UserProfilePolls = ({ profileId }) => {
  const [params, setParams] = useState({
    user_id: profileId,
    sort_by: 'updated.desc',
  });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/polls', params);

  return (
    <Container>
      {!error && content.length > 0 && (
        <UserProfileGrid minWidth="29rem" gridGap="1rem">
          {content.map((poll, i) =>
            content.length === i + 1 ? (
              <div key={`poll${poll.id}`} ref={lastElementRef}>
                <UserProfilePollCard poll={poll} />
              </div>
            ) : (
              <div key={`poll${poll.id}`}>
                <UserProfilePollCard poll={poll} />
              </div>
            )
          )}
        </UserProfileGrid>
      )}
    </Container>
  );
};

export default UserProfilePolls;
