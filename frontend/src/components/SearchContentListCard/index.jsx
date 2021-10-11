import React, { useState } from 'react';
import { BsImage } from 'react-icons/bs';

import {
  Container,
  ThumbnailWrapper,
  Thumbnail,
  TextWrapper,
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

const formatCount = (votes) => {
  if (votes < 1e3) return votes;
  if (votes >= 1e3 && votes < 1e6) return +(votes / 1e3).toFixed(1) + 'K';
  if (votes >= 1e6 && votes < 1e9) return +(votes / 1e6).toFixed(1) + 'M';
  if (votes >= 1e9 && votes < 1e12) return +(votes / 1e9).toFixed(1) + 'B';
  if (votes >= 1e12) return +(votes / 1e12).toFixed(1) + 'T';
};

const SearchContentListCard = ({ contentList }) => {
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
  } = contentList;

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
          <Likes>
            {`${formatCount(likes)}`.replace('.', ',')}{' '}
            {likes === 1 ? 'curtida' : 'curtidas'}
          </Likes>
          <MetaSeparator>•</MetaSeparator>
          <Forks>
            {`${formatCount(forks)}`.replace('.', ',')}{' '}
            {forks === 1 ? 'fork' : 'forks'}
          </Forks>
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

export default SearchContentListCard;
