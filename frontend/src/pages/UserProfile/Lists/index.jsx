import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { GoSearch } from 'react-icons/go';

import setQueryParamAndGetNewUrl from '../../../utils/setQueryParamAndGetNewUrl';
import SingleOptionSelect from '../../../components/SingleOptionSelect';
import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import ListCard from '../../../components/ListCard';
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

const Lists = () => {
  const { id: profileId } = useParams();
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
    useLoadMoreWhenLastElementIsOnScreen('/contentlists', params);

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
                  key={`listOrderBy${i}`}
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
        <NotFound>Nenhuma lista encontrada.</NotFound>
      )}
      {content.length > 0 && (
        <Grid minWidth="29rem" gridGap="1rem">
          {content.map((contentList, i) =>
            content.length === i + 1 ? (
              <div key={`contentList${contentList.id}`} ref={lastElementRef}>
                <ListCard contentList={contentList} />
              </div>
            ) : (
              <div key={`contentList${contentList.id}`}>
                <ListCard contentList={contentList} />
              </div>
            )
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Lists;
