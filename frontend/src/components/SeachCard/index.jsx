import React from 'react';

import {
  Container,
  Thumbnail,
  TextWrapper,
  Title,
  Meta,
  Description,
} from './styles';

const SearchCard = ({ title, description, thumbnail, userName }) => {
  return (
    <Container>
      <Thumbnail src={thumbnail} />
      <TextWrapper>
        <Title>{title}</Title>
        <Meta>
          <span>{userName}</span>
        </Meta>
        <Description>
          <span>{description}</span>
        </Description>
      </TextWrapper>
    </Container>
  );
};

export default SearchCard;
