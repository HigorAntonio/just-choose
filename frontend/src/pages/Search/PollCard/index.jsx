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
    profile_name: profileName,
    profile_display_name: profileDisplayName,
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
        <Link to={`/polls/${pollId}`} data-prevent-container-click>
          <ThumbnailWrapper data-prevent-container-click>
            <Thumbnail
              src={thumbnail}
              onError={() => setThumbnailError(true)}
              error={thumbnailError}
              data-prevent-container-click
            />
            {thumbnailError && (
              <BsImage
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            )}
            <TimeFromNow data-prevent-container-click>
              {fromNow(updated_at)}
            </TimeFromNow>
          </ThumbnailWrapper>
        </Link>
      </ThumbnailContainer>
      <TextWrapperLargeScreen>
        <Title title={title}>
          <Link to={`/polls/${pollId}`} data-prevent-container-click>
            {title}
          </Link>
        </Title>
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
            <Link to={`/profiles/${profileName}`} data-prevent-container-click>
              <ProfileImage
                src={profileImageUrl}
                onError={() => setProfileImageError(true)}
                error={profileImageError}
                data-prevent-container-click
              />
            </Link>
          </ProfileImageWrapper>
          <ProfileName>
            <Link to={`/profiles/${profileName}`} data-prevent-container-click>
              {profileDisplayName}
            </Link>
          </ProfileName>
        </ProfileInfo>
        <DescriptionWrapper>
          <Description>{description}</Description>
        </DescriptionWrapper>
      </TextWrapperLargeScreen>
      <TextWrapperSmallScreen>
        <ProfileImageWrapper>
          <Link to={`/profiles/${profileName}`} data-prevent-container-click>
            <ProfileImage
              src={profileImageUrl}
              onError={() => setProfileImageError(true)}
              error={profileImageError}
              data-prevent-container-click
            />
          </Link>
        </ProfileImageWrapper>
        <Meta>
          <Title title={title}>
            <Link to={`/polls/${pollId}`} data-prevent-container-click>
              {title}
            </Link>
          </Title>
          <Meta>
            <ProfileName>
              <Link
                to={`/profiles/${profileName}`}
                data-prevent-container-click
              >
                {profileDisplayName}
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
