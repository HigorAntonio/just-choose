import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { GoSearch } from 'react-icons/go';

import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';
import SingleOptionSelect from '../SingleOptionSelect';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import UserProfilePollCard from '../UserProfilePollCard';
import UserProfileGrid from '../UserProfileGrid';

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

const UserProfilePolls = ({ profileId }) => {
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { query, sort = 'updated.desc' } = queryParams;
  const history = useHistory();
  const [params, setParams] = useState({
    user_id: profileId,
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
      user_id: profileId,
      sort_by: sort,
      query,
    });
  }, [profileId, sort, query]);

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/polls', params);

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
            <GoSearch size={15} style={{ flexShrink: 0 }} />
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
            width="155px"
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
      {content.length > 0 && (
        <UserProfileGrid minWidth="29rem" gridGap="1rem">
          {content.map((poll, i) =>
            content.length === i + 1 ? (
              <div key={`poll${poll.id}`} ref={lastElementRef}>
                <UserProfilePollCard poll={poll} />
              </div>
            ) : (
              <div key={`poll${poll.id}`}>
                <UserProfilePollCard poll={poll} />
              </div>
            )
          )}
        </UserProfileGrid>
      )}
      {content.length === 0 && query && (
        <NotFound>Nenhuma votação encontrada.</NotFound>
      )}
    </Container>
  );
};

export default UserProfilePolls;
