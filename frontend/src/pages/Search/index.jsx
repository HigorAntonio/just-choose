import React, { useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

import { LayoutContext } from '../../context/LayoutContext';

import MainResults from './MainResults';
import InfinityLoadProfiles from './InfinityLoadProfiles';
import InfinityLoadPolls from './InfinityLoadPolls';
import InfinityLoadContentLists from './InfinityLoadContentLists';

import { Container } from './styles';

const Search = () => {
  const location = useLocation();
  const { query, type } = queryString.parse(location.search);
  const history = useHistory();

  const { contentWrapperRef } = useContext(LayoutContext);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef, query, type]);

  useEffect(() => {
    if (!query) {
      history.replace('/');
    }
  }, [query, history]);

  const isTypeValid = () => {
    return type === 'profile' || type === 'poll' || type === 'content_list';
  };

  return (
    <Container>
      {!isTypeValid() && <MainResults query={query} path={location.pathname} />}
      {isTypeValid() && (
        <>
          {type === 'profile' && <InfinityLoadProfiles query={query} />}
          {type === 'poll' && <InfinityLoadPolls query={query} />}
          {type === 'content_list' && (
            <InfinityLoadContentLists query={query} />
          )}
        </>
      )}
    </Container>
  );
};

export default Search;
