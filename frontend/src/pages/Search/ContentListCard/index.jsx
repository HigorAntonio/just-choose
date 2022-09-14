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
  Likes,
  Forks,
  MetaSeparator,
  ProfileInfo,
  ProfileName,
  ProfileImageWrapper,
  ProfileImage,
  DescriptionWrapper,
  Description,
} from './styles';

const ContentListCard = ({ contentList }) => {
  const history = useHistory();

  const {
    id: listId,
    profile_name: profileName,
    profile_display_name: profileDisplayName,
    profile_image_url: profileImageUrl,
    title,
    description,
    thumbnail,
    likes,
    forks,
    updated_at,
  } = contentList;

  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleContainerClick = (e) => {
    if (!e.target.hasAttribute('data-prevent-container-click')) {
      history.push(`/lists/${listId}`);
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
        <Link to={`/lists/${listId}`} data-prevent-container-click>
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
          <Link to={`/lists/${listId}`} data-prevent-container-click>
            {title}
          </Link>
        </Title>
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
            <Link to={`/lists/${listId}`} data-prevent-container-click>
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
        </Meta>
      </TextWrapperSmallScreen>
    </Container>
  );
};

export default ContentListCard;
