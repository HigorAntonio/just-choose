import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../../context/ViewportContext';

import ListCard from '../../../components/ListCard';

import { Container } from './styles';

const FollowingLists = ({ content }) => {
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
      {content &&
        content.length > 0 &&
        [...Array(6).keys()].map((_, i) => {
          if (i < lastContentIndex && content[i]) {
            return (
              <div key={`followingList${content[i].id}`}>
                <ListCard contentList={content[i]} />
              </div>
            );
          }
          if (i < lastContentIndex) {
            return <div key={`followingListEmpty${i}`} />;
          }
          return '';
        })}
    </Container>
  );
};

export default FollowingLists;
