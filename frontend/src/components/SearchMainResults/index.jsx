import React from 'react';

import useSearch from '../../hooks/useSearch';

import SearchNotFound from '../SearchNotFound';
import SearchResultsGroup from '../SearchResultsGroup';
import SearchProfileCard from '../SearchProfileCard';
import SearchPollCard from '../SearchPollCard';
import SearchContentListCard from '../SearchContentListCard';

import { Container } from './styles';

const SearchMainResults = ({ query, path }) => {
  const { loading, error, content } = useSearch(query);

  const searchProfileResults = (profiles) =>
    profiles.map((profile) => (
      <SearchProfileCard key={`profile${profile.id}`} profile={profile} />
    ));

  const searchPollsResults = (polls) =>
    polls.map((poll) => <SearchPollCard key={`poll${poll.id}`} poll={poll} />);

  const searchContentListsResults = (contentLists) =>
    contentLists.map((contentList) => (
      <SearchContentListCard
        key={`contentList${contentList.id}`}
        contentList={contentList}
      />
    ));

  return (
    <>
      {!loading &&
        content.profiles.results.length === 0 &&
        content.polls.results.length === 0 &&
        content.content_lists.results.length === 0 && (
          <SearchNotFound query={query} />
        )}
      {!loading && !error && content && (
        <Container>
          {content.profiles && content.profiles.results.length > 0 && (
            <SearchResultsGroup
              title="Perfis"
              content={content.profiles}
              renderInMain={searchProfileResults}
              path={`${path}?query=${query}&type=profile`}
            />
          )}
          {content.polls && content.polls.results.length > 0 && (
            <SearchResultsGroup
              title="Votações"
              content={content.polls}
              renderInMain={searchPollsResults}
              path={`${path}?query=${query}&type=poll`}
            />
          )}
          {content.content_lists &&
            content.content_lists.results.length > 0 && (
              <SearchResultsGroup
                title="Listas"
                content={content.content_lists}
                renderInMain={searchContentListsResults}
                path={`${path}?query=${query}&type=content_list`}
              />
            )}
        </Container>
      )}
    </>
  );
};

export default SearchMainResults;
