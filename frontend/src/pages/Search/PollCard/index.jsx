import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';

import { fromNow } from '../../../utils/dataUtility';

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
  MetaSeparator,
  ProfileInfo,
  UserName,
  ProfileImageWrapper,
  ProfileImage,
  DescriptionWrapper,
  Description,
} from './styles';

const PollCard = ({ poll }) => {
  const history = useHistory();

  const {
    id: pollId,
    user_id: userId,
    user_name: userName,
    profile_image_url: profileImageUrl,
    title,
    description,
    thumbnail,
    is_active: isActive,
    updated_at,
  } = poll;

  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleContainerClick = (e) => {
    if (!['A', 'svg', 'path', 'IMG'].includes(e.target.tagName)) {
      history.push(`/polls/${pollId}`);
    }
  };

  return (
    <Container onClick={handleContainerClick}>
      <ThumbnailContainer>
        <ThumbnailWrapper>
          <Link to={`/polls/${pollId}`}>
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
          <Link to={`/polls/${pollId}`}>{title}</Link>
        </Title>
        <Meta>
          <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
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
            <Link to={`/polls/${pollId}`}>{title}</Link>
          </Title>
          <Meta>
            <UserName>{userName}</UserName>
            <MetaSeparator>•</MetaSeparator>
            <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
          </Meta>
        </Meta>
      </TextWrapperSmallScreen>
    </Container>
  );
};

export default PollCard;
