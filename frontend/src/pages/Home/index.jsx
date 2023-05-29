import React, { useEffect, useContext } from 'react';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';

import Trending from './Trending';
import Following from './Following';
import Votes from './Votes';

import { Container, Wrapper } from './styles';

const Home = () => {
  const { contentWrapperRef } = useContext(LayoutContext);
  const { authentication } = useContext(AuthContext);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  return (
    <Container>
      <Wrapper>
        <Trending />
        {authentication?.profile?.is_active && <Following />}
        {authentication && <Votes />}
      </Wrapper>
    </Container>
  );
};

export default Home;
