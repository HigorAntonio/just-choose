import React from 'react';

import useSearch from '../../../hooks/useSearch';

import NotFound from '../NotFound';
import ResultsGroup from '../ResultsGroup';
import ProfileCard from '../ProfileCard';
import PollCard from '../PollCard';
import ContentListCard from '../ContentListCard';

import { Container } from './styles';

const MainResults = ({ query, path }) => {
  const { loading, error, content } = useSearch(query);

  const searchProfileResults = (profiles) =>
    profiles.map((profile) => (
      <ProfileCard key={`profile${profile.id}`} profile={profile} />
    ));

  const searchPollsResults = (polls) =>
    polls.map((poll) => <PollCard key={`poll${poll.id}`} poll={poll} />);

  const searchContentListsResults = (contentLists) =>
    contentLists.map((contentList) => (
      <ContentListCard
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
          <NotFound query={query} />
        )}
      {!loading && !error && content && (
        <Container>
          {content.profiles && content.profiles.results.length > 0 && (
            <ResultsGroup
              title="Perfis"
              content={content.profiles}
              renderInMain={searchProfileResults}
              path={`${path}?query=${query}&type=profile`}
            />
          )}
          {content.polls && content.polls.results.length > 0 && (
            <ResultsGroup
              title="Votações"
              content={content.polls}
              renderInMain={searchPollsResults}
              path={`${path}?query=${query}&type=poll`}
            />
          )}
          {content.content_lists &&
            content.content_lists.results.length > 0 && (
              <ResultsGroup
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

export default MainResults;
