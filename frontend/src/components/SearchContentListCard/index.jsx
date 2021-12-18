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
      <ThumbnailWrapper>
        <Link to={`/lists/${listId}`}>
          <Thumbnail
            src={thumbnail}
            onError={() => setThumbnailError(true)}
            error={thumbnailError}
          />
          {thumbnailError && <BsImage />}
        </Link>
      </ThumbnailWrapper>
      <TextWrapper>
        <Title title={title}>
          <Link to={`/lists/${listId}`}>{title}</Link>
        </Title>
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
      </TextWrapper>
    </Container>
  );
};

export default SearchContentListCard;
