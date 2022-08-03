import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
  const history = useHistory();

  const [thumbnailError, setThumbnailError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  const handleContainerClick = (e) => {
    if (!e.target.hasAttribute('data-prevent-container-click')) {
      history.push(`/polls/${pollId}`);
    }
  };

  const handleContainerOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContainerClick(e);
    }
  };

  return (
    <Container
      onClick={handleContainerClick}
      onKeyPress={handleContainerOnKeyPress}
      tabIndex="0"
    >
      <CardWrapper>
        <Top>
          <ThumbWrapper>
            <Thumbnail
              src={thumbnail}
              onError={() => setThumbnailError(true)}
              error={thumbnailError}
            />
            {thumbnailError && <BsImage />}
            <TimeFromNow>{fromNow(updated_at)}</TimeFromNow>
          </ThumbWrapper>
        </Top>
        <Bottom>
          {showProfile && (
            <ProfileImageWrapper>
              <Link to={`/profiles/${profileId}`} data-prevent-container-click>
                <ProfileImage
                  src={profileImageUrl}
                  onError={() => setProfileImageError(true)}
                  error={profileImageError}
                  data-prevent-container-click
                />
              </Link>
            </ProfileImageWrapper>
          )}
          <Meta>
            <Title title={title}>{title}</Title>
            {showProfile && (
              <ProfileName>
                <Link
                  to={`/profiles/${profileId}`}
                  data-prevent-container-click
                >
                  {profileName}
                </Link>
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
    </Container>
  );
};

export default PollCard;
