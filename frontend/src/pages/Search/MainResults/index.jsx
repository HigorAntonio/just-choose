import React from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';

import NotFound from '../NotFound';
import ResultsGroup from '../ResultsGroup';
import ProfileCard from '../ProfileCard';
import PollCard from '../PollCard';
import ContentListCard from '../ContentListCard';

import { Container } from './styles';

const MainResults = ({ query, path }) => {
  const { isFetching, error, data } = useQuery(
    ['search/mainResults', query],
    async () => {
      const response = await justChooseApi.get('/search', {
        params: { query },
      });
      return response.data;
    }
  );

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
      {!isFetching &&
        data?.results?.profiles?.results?.length === 0 &&
        data?.results?.polls?.results?.length === 0 &&
        data?.results?.content_lists?.results?.length === 0 && (
          <NotFound query={query} />
        )}
      {!isFetching && !error && (
        <Container>
          {data?.results?.profiles?.results?.length > 0 && (
            <ResultsGroup
              title="Perfis"
              content={data?.results?.profiles}
              renderInMain={searchProfileResults}
              path={`${path}?query=${query}&type=profile`}
            />
          )}
          {data?.results?.polls?.results?.length > 0 && (
            <ResultsGroup
              title="Votações"
              content={data?.results?.polls}
              renderInMain={searchPollsResults}
              path={`${path}?query=${query}&type=poll`}
            />
          )}
          {data?.results?.content_lists?.results?.length > 0 && (
            <ResultsGroup
              title="Listas"
              content={data?.results?.content_lists}
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
