import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';

import { fromNow } from '../../utils/dataUtility';
import formatCount from '../../utils/formatCount';

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
  UserName,
  ProfileImageWrapper,
  ProfileImage,
  DescriptionWrapper,
  Description,
} from './styles';

const SearchContentListCard = ({ contentList }) => {
  const history = useHistory();

  const {
    id: listId,
    user_id: userId,
    user_name: userName,
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
    if (!['A', 'svg', 'path', 'IMG'].includes(e.target.tagName)) {
      history.push(`/lists/${listId}`);
    }
  };

  return (
    <Container onClick={handleContainerClick}>
      <ThumbnailContainer>
        <ThumbnailWrapper>
          <Link to={`/lists/${listId}`}>
            <Thumbnail
              src={thumbnail}
              onError={() => setThumbnailError(true)}
              error={thumbnailError}
            />
            {thumbnailError && <BsImage />}
            <TimeFromNow>{fromNow(updated_at)}</TimeFromNow>
          </Link>
        </ThumbnailWrapper>
      </ThumbnailContainer>
      <TextWrapperLargeScreen>
        <Title title={title}>
          <Link to={`/lists/${listId}`}>{title}</Link>
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
            <Link to={`/users/${userId}`}>
              <ProfileImage
                src={profileImageUrl}
                onError={() => setProfileImageError(true)}
                error={profileImageError}
              />
            </Link>
          </ProfileImageWrapper>
          <UserName>
            <Link to={`/users/${userId}`}>{userName}</Link>
          </UserName>
        </ProfileInfo>
        <DescriptionWrapper>
          <Description>{description}</Description>
        </DescriptionWrapper>
      </TextWrapperLargeScreen>
      <TextWrapperSmallScreen>
        <ProfileImageWrapper>
          <Link to={`/users/${userId}`}>
            <ProfileImage
              src={profileImageUrl}
              onError={() => setProfileImageError(true)}
              error={profileImageError}
            />
          </Link>
        </ProfileImageWrapper>
        <Meta>
          <Title title={title}>
            <Link to={`/lists/${listId}`}>{title}</Link>
          </Title>
          <Meta>
            <UserName>{userName}</UserName>
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

export default SearchContentListCard;
