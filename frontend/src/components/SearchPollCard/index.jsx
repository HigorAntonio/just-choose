import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
  } = poll;

  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleContainerClick = () => {
    history.push(`/polls/${pollId}`);
  };

  return (
    <Container onClick={handleContainerClick}>
      <ThumbnailWrapper onClick={(e) => e.stopPropagation()}>
        <Link to={`/polls/${pollId}`}>
          <Thumbnail
            src={thumbnail}
            onError={() => setThumbnailError(true)}
            error={thumbnailError}
          />
          {thumbnailError && <BsImage />}
        </Link>
      </ThumbnailWrapper>
      <TextWrapper>
        <Title onClick={(e) => e.stopPropagation()}>
          <Link to={`/polls/${pollId}`}>{title}</Link>
        </Title>
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
          <UserName onClick={(e) => e.stopPropagation()}>
            <Link to={`/users/${userId}`}>{userName}</Link>
          </UserName>
        </ProfileInfo>
        <DescriptionWrapper>
          <Description>{description}</Description>
        </DescriptionWrapper>
      </TextWrapper>
    </Container>
  );
};

export default SearchPollCard;
