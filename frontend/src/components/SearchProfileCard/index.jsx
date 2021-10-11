import React, { useState } from 'react';

import {
  Container,
  ProfileImageWrapper,
  ProfileImage,
  TextWrapper,
  UserName,
  Meta,
  FollowersCount,
  DescriptionWrapper,
  Description,
} from './styles';

const SearchProfileCard = ({ profile }) => {
  const {
    id: profileId,
    name: userName,
    followers_count: followersCount,
    following_count: followingCount,
  } = profile;
  const profileImageUrl = profile.profile_image_url
    ? profile.profile_image_url
    : '';

  const [profileImageError, setProfileImageError] = useState(false);

  return (
    <Container>
      <ProfileImageWrapper>
        <ProfileImage
          src={profileImageUrl}
          onError={() => setProfileImageError(true)}
          error={profileImageError}
        />
      </ProfileImageWrapper>
      <TextWrapper>
        <UserName>{userName}</UserName>
        <Meta>
          <FollowersCount>
            {followersCount}
            {followersCount === 1 ? ' seguidor' : ' seguidores'}
          </FollowersCount>
        </Meta>
        <DescriptionWrapper>
          <Description></Description>
        </DescriptionWrapper>
      </TextWrapper>
    </Container>
  );
};

export default SearchProfileCard;
