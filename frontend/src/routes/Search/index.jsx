import React, { useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

import { LayoutContext } from '../../context/LayoutContext';

import SearchMainResults from '../../components/SearchMainResults';
import SearchInfinityLoadProfiles from '../../components/SearchInfinityLoadProfiles';
import SearchInfinityLoadPolls from '../../components/SearchInfinityLoadPolls';
import SearchInfinityLoadContentLists from '../../components/SearchInfinityLoadContentLists';

import { Container } from './styles';

const Search = () => {
  const location = useLocation();
  const { query, type } = queryString.parse(location.search);
  const history = useHistory();

  const { contentWrapperRef } = useContext(LayoutContext);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

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
      {!isTypeValid() && (
        <SearchMainResults query={query} path={location.pathname} />
      )}
      {isTypeValid() && (
        <>
          {type === 'profile' && <SearchInfinityLoadProfiles query={query} />}
          {type === 'poll' && <SearchInfinityLoadPolls query={query} />}
          {type === 'content_list' && (
            <SearchInfinityLoadContentLists query={query} />
          )}
        </>
      )}
    </Container>
  );
};

export default Search;
