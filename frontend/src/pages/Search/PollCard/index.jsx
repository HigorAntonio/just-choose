import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';

import { fromNow } from '../../../utils/dataUtility';
import formatCount from '../../../utils/formatCount';

import {
  Container,
  ThumbnailContainer,
  ThumbnailWrapper,
  Thumbnail,
  TimeFromNow,
  TextWrapperLargeScreen,
  TextWrapperSmallScreen,
  Title,
  Meta,
  PollStatus,
  TotalVotes,
  MetaSeparator,
  ProfileInfo,
  ProfileName,
  ProfileImageWrapper,
  ProfileImage,
  DescriptionWrapper,
  Description,
} from './styles';

const PollCard = ({ poll }) => {
  const history = useHistory();

  const {
    id: pollId,
    profile_id: profileId,
    profile_name: profileName,
    profile_image_url: profileImageUrl,
    title,
    description,
    thumbnail,
    is_active: isActive,
    total_votes: totalVotes,
    updated_at,
  } = poll;

  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

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
      <ThumbnailContainer>
        <ThumbnailWrapper>
          <Thumbnail
            src={thumbnail}
            onError={() => setThumbnailError(true)}
            error={thumbnailError}
          />
          {thumbnailError && <BsImage />}
          <TimeFromNow>{fromNow(updated_at)}</TimeFromNow>
        </ThumbnailWrapper>
      </ThumbnailContainer>
      <TextWrapperLargeScreen>
        <Title title={title}>{title}</Title>
        <Meta>
          <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
          <MetaSeparator>•</MetaSeparator>
          <TotalVotes>
            {formatCount(totalVotes) + ' '}
            {totalVotes === 1 ? 'voto' : 'votos'}
          </TotalVotes>
        </Meta>
        <ProfileInfo>
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
          <ProfileName>
            <Link to={`/profiles/${profileId}`} data-prevent-container-click>
              {profileName}
            </Link>
          </ProfileName>
        </ProfileInfo>
        <DescriptionWrapper>
          <Description>{description}</Description>
        </DescriptionWrapper>
      </TextWrapperLargeScreen>
      <TextWrapperSmallScreen>
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
        <Meta>
          <Title title={title}>{title}</Title>
          <Meta>
            <ProfileName>
              <Link to={`/profiles/${profileId}`} data-prevent-container-click>
                {profileName}
              </Link>
            </ProfileName>
            <MetaSeparator>•</MetaSeparator>
            <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
            <MetaSeparator>•</MetaSeparator>
            <TotalVotes>
              {formatCount(totalVotes) + ' '}
              {totalVotes === 1 ? 'voto' : 'votos'}
            </TotalVotes>
          </Meta>
        </Meta>
      </TextWrapperSmallScreen>
    </Container>
  );
};

export default PollCard;
