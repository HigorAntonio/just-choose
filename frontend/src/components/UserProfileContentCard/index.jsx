import React, { useState } from 'react';
import { BsImage } from 'react-icons/bs';

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

const UserProfileContentCard = ({
  contentList = {
    id: 1,
    thumbnail:
      'http://localhost:3333/files/06f301969844b23c331f71b8d2741784-black_mirror.jpg',
    title: 'JINGLE ALL THE WAY | Siga @patriota nas redes',
    likes: 342,
    forks: 138,
  },
}) => {
  const { id: listId, thumbnail, title, likes, forks } = contentList;

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
          <TimeFromNow>anteontem</TimeFromNow>
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

export default UserProfileContentCard;