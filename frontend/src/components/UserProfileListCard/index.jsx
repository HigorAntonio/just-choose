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
  Likes,
  MetaSeparator,
  Forks,
} from './styles';

const formatCount = (votes) => {
  if (votes < 1e3) return votes;
  if (votes >= 1e3 && votes < 1e6) return +(votes / 1e3).toFixed(1) + 'K';
  if (votes >= 1e6 && votes < 1e9) return +(votes / 1e6).toFixed(1) + 'M';
  if (votes >= 1e9 && votes < 1e12) return +(votes / 1e9).toFixed(1) + 'B';
  if (votes >= 1e12) return +(votes / 1e12).toFixed(1) + 'T';
};

const UserProfileListCard = ({ contentList }) => {
  const {
    id: listId,
    thumbnail,
    title,
    likes,
    forks,
    updated_at,
  } = contentList;

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
            <Likes>
              {`${formatCount(likes)}`.replace('.', ',')}{' '}
              {likes === 1 ? 'curtida' : 'curtidas'}
            </Likes>
            <MetaSeparator>•</MetaSeparator>
            <Forks>
              {`${formatCount(forks)}`.replace('.', ',')}{' '}
              {forks === 1 ? 'fork' : 'forks'}
            </Forks>
          </Meta>
        </Bottom>
      </CardWrapper>
    </Container>
  );
};

export default UserProfileListCard;
