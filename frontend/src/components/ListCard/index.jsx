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
  Likes,
  MetaSeparator,
  Forks,
} from './styles';

const ListCard = ({ contentList, showProfile = false }) => {
  const {
    id: listId,
    profile_id: profileId,
    profile_name: profileName,
    profile_image_url: profileImageUrl,
    thumbnail,
    title,
    likes,
    forks,
    updated_at,
  } = contentList;
  const history = useHistory();

  const [thumbnailError, setThumbnailError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

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
      <CardWrapper>
        <Top>
          <Link to={`/lists/${listId}`} data-prevent-container-click>
            <ThumbWrapper data-prevent-container-click>
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
            </ThumbWrapper>
          </Link>
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
            <Title title={title}>
              <Link to={`/lists/${listId}`} data-prevent-container-click>
                {title}
              </Link>
            </Title>
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
        </Bottom>
      </CardWrapper>
    </Container>
  );
};

export default ListCard;
