import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { GoSearch } from 'react-icons/go';

import setQueryParamAndGetNewUrl from '../../../utils/setQueryParamAndGetNewUrl';
import SingleOptionSelect from '../../../components/SingleOptionSelect';
import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';
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
  { key: 'Título (A-Z)', value: 'poll_title.asc' },
  { key: 'Título (Z-A)', value: 'poll_title.desc' },
];

const isSortValid = (sort) => {
  return !!sortByList.find((e) => e.value === sort);
};

const Votes = () => {
  const { id: profileId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { query, sort = 'updated.desc' } = queryParams;
  const history = useHistory();
  const [params, setParams] = useState({
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
      profile_id: profileId,
      sort_by: sort,
      query,
    });
  }, [profileId, sort, query]);

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen(
      `/profiles/${profileId}/votes`,
      params
    );

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
    if (sort !== sb.value) {
      setShowSortOptions(false);
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
            <GoSearch size={'1.5rem'} style={{ flexShrink: 0 }} />
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
      {!loading && content.length === 0 && (
        <NotFound>Nenhum voto encontrado.</NotFound>
      )}
      {content.length > 0 && (
        <Grid minWidth="29rem" gridGap="1rem">
          {content.map((vote, i) => {
            const poll = {
              id: vote.poll_id,
              thumbnail: vote.poll_thumbnail,
              title: vote.poll_title,
              is_active: vote.poll_is_active,
              total_votes: vote.poll_total_votes,
              updated_at: vote.updated_at,
            };
            return content.length === i + 1 ? (
              <div key={`vote${vote.poll_id}`} ref={lastElementRef}>
                <PollCard poll={poll} />
              </div>
            ) : (
              <div key={`vote${vote.poll_id}`}>
                <PollCard poll={poll} />
              </div>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Votes;
