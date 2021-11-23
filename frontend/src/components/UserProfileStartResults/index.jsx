import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../context/ViewportContext';

import UserProfileContentCard from '../UserProfileContentCard';

import { Container, TitleWrapper, Title, Main } from './styles';

const UserProfileStartResults = ({ title }) => {
  const { width } = useContext(ViewportContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);
  const [content, setContent] = useState([...Array(6).keys()]);

  useEffect(() => {
    setLastContentIndex(content.length);
  }, [content]);

  useEffect(() => {
    console.debug('width:', width);
    if (width < 547) {
      setLastContentIndex(1);
    } else if (width < 938) {
      setLastContentIndex(2);
    } else if (width < 1200) {
      setLastContentIndex(3);
    } else if (width < 1555) {
      setLastContentIndex(3);
    } else if (width < 1855) {
      setLastContentIndex(4);
    } else if (width < 2155) {
      setLastContentIndex(5);
    } else {
      setLastContentIndex(6);
    }
  }, [width]);

  return (
    <Container>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      <Main>
        {content.map((c, i) =>
          i < lastContentIndex ? <UserProfileContentCard key={c} /> : ''
        )}
      </Main>
    </Container>
  );
};

export default UserProfileStartResults;
