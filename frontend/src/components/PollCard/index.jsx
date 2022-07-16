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
  ProfileImageWrapper,
  ProfileImage,
  ProfileName,
  Title,
  Meta,
  PollStatus,
  TotalVotes,
  MetaSeparator,
} from './styles';

const PollCard = ({ poll, showProfile = false }) => {
  const {
    id: pollId,
    profile_id: profileId,
    profile_name: profileName,
    profile_image_url: profileImageUrl,
    thumbnail,
    title,
    is_active: isActive,
    total_votes: totalVotes,
    updated_at,
  } = poll;

  const [thumbnailError, setThumbnailError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

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
            {showProfile && (
              <ProfileImageWrapper>
                <Link to={`/profiles/${profileId}`}>
                  <ProfileImage
                    src={profileImageUrl}
                    onError={() => setProfileImageError(true)}
                    error={profileImageError}
                  />
                </Link>
              </ProfileImageWrapper>
            )}
            <Meta>
              <Title title={title}>{title}</Title>
              {showProfile && (
                <ProfileName>
                  <Link to={`/profiles/${profileId}`}>{profileName}</Link>
                </ProfileName>
              )}
              <Meta>
                <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
                <MetaSeparator>•</MetaSeparator>
                <TotalVotes>
                  {formatCount(totalVotes) + ' '}
                  {totalVotes === 1 ? 'voto' : 'votos'}
                </TotalVotes>
              </Meta>
            </Meta>
          </Bottom>
        </CardWrapper>
      </Link>
    </Container>
  );
};

export default PollCard;
