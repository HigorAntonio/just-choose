import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import formatCount from '../../utils/formatCount';

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
    <Container title={userName}>
      <Link to={`/users/${profileId}`}>
        <ProfileImageWrapper>
          <ProfileImage
            src={profileImageUrl}
            onError={() => setProfileImageError(true)}
            error={profileImageError}
          />
        </ProfileImageWrapper>
        <UserName>{userName}</UserName>
        <Meta>
          <FollowersCount>
            {formatCount(followersCount)}
            {followersCount === 1 ? ' seguidor' : ' seguidores'}
          </FollowersCount>
        </Meta>
      </Link>
    </Container>
  );
};

export default UserProfileFollowingCard;
