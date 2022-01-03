import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';

import { fromNow } from '../../utils/dataUtility';
import formatCount from '../../utils/formatCount';

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
      <Link to={`/lists/${listId}`}>
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
                {formatCount(likes) + ' '}
                {likes === 1 ? 'curtida' : 'curtidas'}
              </Likes>
              <MetaSeparator>•</MetaSeparator>
              <Forks>
                {formatCount(forks) + ' '}
                {forks === 1 ? 'fork' : 'forks'}
              </Forks>
            </Meta>
          </Bottom>
        </CardWrapper>
      </Link>
    </Container>
  );
};

export default UserProfileListCard;
