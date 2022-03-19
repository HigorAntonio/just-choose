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
  UserName,
  Title,
  Meta,
  Likes,
  MetaSeparator,
  Forks,
} from './styles';

const ListCard = ({ contentList, showProfile = false }) => {
  const {
    id: listId,
    user_id: userId,
    user_name: userName,
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
                <Link to={`/users/${userId}`}>
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
                <UserName>
                  <Link to={`/users/${userId}`}>{userName}</Link>
                </UserName>
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
