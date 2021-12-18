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
  PollStatus,
} from './styles';

const formatCount = (votes) => {
  if (votes < 1e3) return votes;
  if (votes >= 1e3 && votes < 1e6) return +(votes / 1e3).toFixed(1) + 'K';
  if (votes >= 1e6 && votes < 1e9) return +(votes / 1e6).toFixed(1) + 'M';
  if (votes >= 1e9 && votes < 1e12) return +(votes / 1e9).toFixed(1) + 'B';
  if (votes >= 1e12) return +(votes / 1e12).toFixed(1) + 'T';
};

const UserProfilePollCard = ({
  poll = {
    id: 1,
    thumbnail:
      'http://localhost:3333/files/92024286d8505464992c35b468f3f2cc-BobaFett.jpg',
    title:
      'Web App Vulnerabilities - DevSecOps Course for Beginners freeCodeCamp.org',
    is_active: true,
  },
}) => {
  const { id: pollId, thumbnail, title, is_active: isActive } = poll;

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
            <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
          </Meta>
        </Bottom>
      </CardWrapper>
    </Container>
  );
};

export default UserProfilePollCard;
