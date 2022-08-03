import React, { useEffect, useContext } from 'react';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';

import Trending from './Trending';
import Following from './Following';
import Votes from './Votes';

import { Container } from './styles';

const Home = () => {
  const { contentWrapperRef } = useContext(LayoutContext);
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  return (
    <Container>
      <h1>Trending</h1>
      <Trending />
      {authenticated && (
        <>
          <h1>Following</h1>
          <Following />
          <h1>Votes</h1>
          <Votes />
        </>
      )}
    </Container>
  );
};

export default Home;
