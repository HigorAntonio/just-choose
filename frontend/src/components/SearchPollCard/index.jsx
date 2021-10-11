import React, { useState } from 'react';
import { BsImage } from 'react-icons/bs';

import {
  Container,
  ThumbnailWrapper,
  Thumbnail,
  TextWrapper,
  Title,
  Meta,
  PollStatus,
  ProfileInfo,
  UserName,
  ProfileImageWrapper,
  ProfileImage,
  DescriptionWrapper,
  Description,
} from './styles';

const SearchPollCard = ({ poll }) => {
  const {
    id: pollId,
    user_id: userId,
    user_name: userName,
    profile_image_url: profileImageUrl,
    title,
    description,
    thumbnail,
    is_active: isActive,
  } = poll;

  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <Container>
      <ThumbnailWrapper>
        <Thumbnail
          src={thumbnail}
          onError={() => setThumbnailError(true)}
          error={thumbnailError}
        />
        {thumbnailError && <BsImage />}
      </ThumbnailWrapper>
      <TextWrapper>
        <Title>{title}</Title>
        <Meta>
          <PollStatus>{isActive ? 'Aberta' : 'Fechada'}</PollStatus>
        </Meta>
        <ProfileInfo>
          <ProfileImageWrapper>
            <ProfileImage
              src={profileImageUrl}
              onError={() => setProfileImageError(true)}
              error={profileImageError}
            />
          </ProfileImageWrapper>
          <UserName>{userName}</UserName>
        </ProfileInfo>
        <DescriptionWrapper>
          <Description>{description}</Description>
        </DescriptionWrapper>
      </TextWrapper>
    </Container>
  );
};

export default SearchPollCard;
