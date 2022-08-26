import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../../context/ViewportContext';

import PollCard from '../../../components/PollCard';

import { Container, Wrapper, TitleWrapper, Title } from './styles';

const FollowingPolls = ({ content }) => {
  const { width } = useContext(ViewportContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);

  useEffect(() => {
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
        <Title>Votações de perfis seguidos</Title>
      </TitleWrapper>
      <Wrapper>
        {content &&
          content.length > 0 &&
          [...Array(6).keys()].map((_, i) => {
            if (i < lastContentIndex && content[i]) {
              return (
                <div key={`trendingPoll${content[i].id}`}>
                  <PollCard poll={content[i]} showProfile />
                </div>
              );
            }
            if (i < lastContentIndex) {
              return <div key={`trendingPollEmpty${i}`} />;
            }
            return '';
          })}
      </Wrapper>
    </Container>
  );
};

export default FollowingPolls;
