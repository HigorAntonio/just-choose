import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { GoSearch } from 'react-icons/go';

import SingleOptionSelect from '../SingleOptionSelect';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import UserProfileListCard from '../UserProfileListCard';
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
  { key: 'Popularidade (maior)', value: 'popularity.desc' },
  { key: 'Popularidade (menor)', value: 'popularity.asc' },
  { key: 'Avaliação (melhor)', value: 'rating.desc' },
  { key: 'Avaliação (pior)', value: 'rating.asc' },
  { key: 'Atualização (novo)', value: 'updated.desc' },
  { key: 'Atualização (antigo)', value: 'updated.asc' },
  { key: 'Título (A-Z)', value: 'title.asc' },
  { key: 'Título (Z-A)', value: 'title.desc' },
];

const isSortValid = (sort) => {
  return !!sortByList.find((e) => e.value === sort);
};

const UserProfileLists = ({ profileId }) => {
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

  const getNewUrl = useCallback(
    (queryKey, queryValue) => {
      const queryParamsKeys = Object.keys(queryParams);
      const queryParamsValues = Object.values(queryParams);

      if (!queryParamsKeys.includes(queryKey)) {
        queryParamsKeys.push(queryKey);
        queryParamsValues.push(queryValue);
      }

      const newPath = `${location.pathname}${queryParamsKeys
        .map((key, i) => {
          const value = key === queryKey ? queryValue : queryParamsValues[i];

          return i === 0 ? `?${key}=${value}` : `&${key}=${value}`;
        })
        .join('')}`;
      return newPath;
    },
    [queryParams, location]
  );

  useEffect(() => {
    if (!isSortValid(sort)) {
      history.replace(getNewUrl('sort', 'updated.desc'));
    }
  }, [sort, history, getNewUrl]);

  useEffect(() => {
    setParams({
      user_id: profileId,
      sort_by: sort,
      query,
    });
  }, [profileId, sort, query]);

  const { loading, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/contentlists', params);

  const handleSearchInputEnterKey = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      history.push(getNewUrl('query', e.target.value));
    }
  };

  const handleSelectSortBy = (sb) => {
    if (sort !== sb.value) {
      setShowSortOptions(false);
      history.push(getNewUrl('sort', sb.value));
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
                  key={`movieOrderByList${i}`}
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
          {content.map((contentList, i) =>
            content.length === i + 1 ? (
              <div key={`contentList${contentList.id}`} ref={lastElementRef}>
                <UserProfileListCard contentList={contentList} />
              </div>
            ) : (
              <div key={`contentList${contentList.id}`}>
                <UserProfileListCard contentList={contentList} />
              </div>
            )
          )}
        </UserProfileGrid>
      )}
      {content.length === 0 && query && (
        <NotFound>Nenhuma lista encontrada.</NotFound>
      )}
    </Container>
  );
};

export default UserProfileLists;
