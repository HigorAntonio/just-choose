import React, { useState, useCallback } from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import FollowingCard from '../FollowingCard';
import Grid from '../Grid';

import { Container, Message } from './styles';

const Following = ({ profileToShowId }) => {
  const [params] = useState({});

  const getFollowingProfiles = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get(
        `/profiles/${profileToShowId}/following`,
        {
          params: { ...params, page: pageParam },
        }
      );
      return response.data;
    },
    [profileToShowId, params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(
      ['profile/following/getFollowingProfiles', params],
      getFollowingProfiles,
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.page < lastPage.total_pages
            ? pages.length + 1
            : undefined;
        },
      }
    );

  return (
    <Container>
      {!isFetching && data?.pages[0]?.total_results === 0 && (
        <Message>Este perfil não apresenta outros perfis.</Message>
      )}
      <Grid minWidth="21rem" gridGap="2rem">
        {data?.pages.map((page) => {
          return page.results.map((profile, i) => {
            if (page.results.length === i + 1) {
              return (
                <div key={profile.id} ref={lastElementRef}>
                  <FollowingCard
                    profile={{
                      name: profile.name,
                      display_name: profile.display_name,
                      profile_image_url: profile.profile_image_url,
                      followers_count: profile.followers_count,
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={profile.id}>
                <FollowingCard
                  profile={{
                    name: profile.name,
                    display_name: profile.display_name,
                    profile_image_url: profile.profile_image_url,
                    followers_count: profile.followers_count,
                  }}
                />
              </div>
            );
          });
        })}
      </Grid>
    </Container>
  );
};

export default Following;
