import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import formatCount from '../../../utils/formatCount';

import {
  Container,
  ProfileImageWrapper,
  ProfileImage,
  TextWrapper,
  ProfileName,
  Meta,
  FollowersCount,
  DescriptionWrapper,
  Description,
} from './styles';

const ProfileCard = ({ profile }) => {
  const {
    name: profileName,
    display_name: profileDisplayName,
    followers_count: followersCount,
  } = profile;
  const profileImageUrl = profile.profile_image_url
    ? profile.profile_image_url
    : '';

  const [profileImageError, setProfileImageError] = useState(false);

  return (
    <Container>
      <Link to={`/profiles/${profileName}`}>
        <ProfileImageWrapper>
          <ProfileImage
            src={profileImageUrl}
            onError={() => setProfileImageError(true)}
            error={profileImageError}
          />
        </ProfileImageWrapper>
        <TextWrapper>
          <ProfileName>{profileDisplayName}</ProfileName>
          <Meta>
            <FollowersCount>
              {formatCount(followersCount)}
              {followersCount === 1 ? ' seguidor' : ' seguidores'}
            </FollowersCount>
          </Meta>
          <DescriptionWrapper>
            <Description></Description>
          </DescriptionWrapper>
        </TextWrapper>
      </Link>
    </Container>
  );
};

export default ProfileCard;
