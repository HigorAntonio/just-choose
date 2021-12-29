import React, { useState } from 'react';
import { BsImage } from 'react-icons/bs';

import { fromNow } from '../../utils/dataUtility';

import {
  Container,
  CardWrapper,
  Top,
  ThumbWrapper,
  Thumbnail,
  TimeFromNow,
  Bottom,
  Title,
  Meta,
  PollStatus,
} from './styles';

const UserProfilePollCard = ({ poll }) => {
  const {
    id: pollId,
    thumbnail,
    title,
    is_active: isActive,
    updated_at,
  } = poll;

  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <Container>
      <CardWrapper>
        <Top>
          <ThumbWrapper>
            <Thumbnail
              src={thumbnail}
              onError={() => setThumbnailError(true)}
              error={thumbnailError}
            />
            {thumbnailError && <BsImage />}
          </ThumbWrapper>
          <TimeFromNow>{fromNow(updated_at)}</TimeFromNow>
        </Top>
        <Bottom>
          <Title title={title}>{title}</Title>
          <Meta>
            <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
          </Meta>
        </Bottom>
      </CardWrapper>
    </Container>
  );
};

export default UserProfilePollCard;
