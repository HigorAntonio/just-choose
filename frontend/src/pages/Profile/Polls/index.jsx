import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { GoSearch } from 'react-icons/go';

import setQueryParamAndGetNewUrl from '../../../utils/setQueryParamAndGetNewUrl';
import SingleOptionSelect from '../../../components/SingleOptionSelect';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import justChooseApi from '../../../services/justChooseApi';
import PollCard from '../../../components/PollCard';
import Grid from '../Grid';

import {
  Container,
  Filters,
  AlignLeftFilters,
  AlignRightFilters,
  SearchWrapper,
  OrderByOptions,
  Option,
  Label,
  NotFound,
} from './styles';

const sortByList = [
  { key: 'Atualização (novo)', value: 'updated.desc' },
  { key: 'Atualização (antigo)', value: 'updated.asc' },
  { key: 'Título (A-Z)', value: 'title.asc' },
  { key: 'Título (Z-A)', value: 'title.desc' },
];

const isSortValid = (sort) => {
  return !!sortByList.find((e) => e.value === sort);
};

const Polls = ({ profileToShowId }) => {
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { query, sort = 'updated.desc' } = queryParams;
  const history = useHistory();
  const [params, setParams] = useState({
    profile_id: profileToShowId,
    sort_by: sort,
    query,
  });
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    if (!isSortValid(sort)) {
      history.replace(
        setQueryParamAndGetNewUrl(
          location.pathname,
          queryParams,
          'sort',
          'updated.desc'
        )
      );
    }
  }, [sort, history, location, queryParams]);

  useEffect(() => {
    setParams({
      profile_id: profileToShowId,
      sort_by: sort,
      query,
    });
  }, [profileToShowId, sort, query]);

  const getPolls = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/polls', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['profile/polls/getPolls', params], getPolls, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.page < lastPage.total_pages
          ? pages.length + 1
          : undefined;
      },
    });

  const handleSearchInputEnterKey = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      history.push(
        setQueryParamAndGetNewUrl(
          location.pathname,
          queryParams,
          'query',
          e.target.value
        )
      );
    }
  };

  const handleSelectSortBy = (sb) => {
    setShowSortOptions(false);
    if (sort !== sb.value) {
      history.push(
        setQueryParamAndGetNewUrl(
          location.pathname,
          queryParams,
          'sort',
          sb.value
        )
      );
    }
  };

  const handleSingleSelectOnPressEnter = (e, cb, option) => {
    if (e.key === 'Enter') {
      cb(option);
      document.activeElement
        .closest('[data-select]')
        .querySelector('[data-select-button]')
        .focus();
    }
  };

  return (
    <Container>
      <Filters>
        <AlignLeftFilters>
          <Label>Filtrar por</Label>
          <SearchWrapper>
            <GoSearch size={'15px'} style={{ flexShrink: 0 }} />
            <input
              type="search"
              id="search"
              placeholder="Buscar"
              onKeyPress={handleSearchInputEnterKey}
            />
          </SearchWrapper>
        </AlignLeftFilters>
        <AlignRightFilters>
          <Label>Ordenar por</Label>
          <SingleOptionSelect
            label={
              !sort || !isSortValid(sort)
                ? 'Selecionar'
                : sortByList.find((e) => e.value === sort).key
            }
            dropDownAlign="center"
            show={showSortOptions}
            setShow={setShowSortOptions}
          >
            <OrderByOptions>
              {sortByList.map((sb, i) => (
                <Option
                  key={`pollOrderBy${i}`}
                  onClick={() => handleSelectSortBy(sb)}
                  onKeyPress={(e) =>
                    handleSingleSelectOnPressEnter(e, handleSelectSortBy, sb)
                  }
                  tabIndex="-1"
                  data-select-option
                >
                  {sb.key}
                </Option>
              ))}
            </OrderByOptions>
          </SingleOptionSelect>
        </AlignRightFilters>
      </Filters>
      {!isFetching && data?.pages[0]?.total_results === 0 && (
        <NotFound>Nenhuma votação encontrada.</NotFound>
      )}
      <Grid minWidth="29rem" gridGap="1rem">
        {data?.pages.map((page) => {
          return page.results.map((poll, i) =>
            page.results.length === i + 1 ? (
              <div key={`poll${poll.id}`} ref={lastElementRef}>
                <PollCard poll={poll} />
              </div>
            ) : (
              <div key={`poll${poll.id}`}>
                <PollCard poll={poll} />
              </div>
            )
          );
        })}
      </Grid>
    </Container>
  );
};

export default Polls;
