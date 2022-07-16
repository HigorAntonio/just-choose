import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import formatCount from '../../../utils/formatCount';

import {
  Container,
  ProfileImageWrapper,
  ProfileImage,
  ProfileName,
  Meta,
  FollowersCount,
} from './styles';

const FollowingCard = ({ profile }) => {
  const {
    id: profileId,
    name: profileName,
    followers_count: followersCount,
  } = profile;
  const profileImageUrl = profile.profile_image_url
    ? profile.profile_image_url
    : '';

  const [profileImageError, setProfileImageError] = useState(false);

  return (
    <Container title={profileName}>
      <Link to={`/profiles/${profileId}`}>
        <ProfileImageWrapper>
          <ProfileImage
            src={profileImageUrl}
            onError={() => setProfileImageError(true)}
            error={profileImageError}
          />
        </ProfileImageWrapper>
        <ProfileName>{profileName}</ProfileName>
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

export default FollowingCard;
