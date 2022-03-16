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
  PollStatus,
  TotalVotes,
  MetaSeparator,
} from './styles';

const PollCard = ({ poll }) => {
  const {
    id: pollId,
    thumbnail,
    title,
    is_active: isActive,
    total_votes: totalVotes,
    updated_at,
  } = poll;

  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <Container>
      <Link to={`/polls/${pollId}`}>
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
              <MetaSeparator>•</MetaSeparator>
              <TotalVotes>
                {formatCount(totalVotes) + ' '}
                {totalVotes === 1 ? 'voto' : 'votos'}
              </TotalVotes>
            </Meta>
          </Bottom>
        </CardWrapper>
      </Link>
    </Container>
  );
};

export default PollCard;
