import React, { useState } from 'react';

import {
  Container,
  ProfileImageWrapper,
  ProfileImage,
  UserName,
  Meta,
  FollowersCount,
} from './styles';

const UserProfileFollowingCard = ({ profile }) => {
  const {
    id: profileId,
    name: userName,
    followers_count: followersCount,
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
      <UserName>UserName</UserName>
      <Meta>
        <FollowersCount>291 seguidores</FollowersCount>
      </Meta>
    </Container>
  );
};

export default UserProfileFollowingCard;
