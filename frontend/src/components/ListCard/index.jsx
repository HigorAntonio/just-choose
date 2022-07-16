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

  const [thumbnailError, setThumbnailError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

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
      </Link>
    </Container>
  );
};

export default ListCard;
