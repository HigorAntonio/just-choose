import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import queryString from 'query-string';

import useSearchRequest from '../../hooks/useSearchRequest';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import SearchCard from '../../components/SeachCard';

import {
  Container,
  Filters,
  FiltersLeft,
  FiltersRight,
  SortOptions,
  Option,
  Main,
  SearchItems,
  SearchItem,
} from './styles';

const getSortOption = (sort) => {
  switch (sort) {
    case 'updated.desc':
      return 'Atualização (novo)';
    case 'updated.asc':
      return 'Atualização (antigo)';
    case 'popularity.asc':
      return 'Popularidade (menor)';
    case 'popularity.desc':
      return 'Popularidade (maior)';
    case 'rating.asc':
      return 'Avaliação (pior)';
    case 'rating.desc':
      return 'Avaliação (melhor)';
    case 'title.asc':
      return 'Título (A-Z)';
    case 'title.desc':
      return 'Título (Z-A)';
    default:
      return '';
  }
};

const Search = ({ wrapperRef }) => {
  const { search } = useLocation();
  const { query } = queryString.parse(search);
  const history = useHistory();

  const { colors } = useContext(ThemeContext);

  const [listParams, setListParams] = useState({});
  const [listPageNumber, setListPageNumber] = useState(1);
  const [pollParams, setPollParams] = useState({});
  const [pollPageNumber, setPollPageNumber] = useState(1);
  const [type, setType] = useState('list');
  const [sortOption, setSortOption] = useState('updated.desc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    setListParams({ query });
    setListPageNumber(1);
    setPollParams({ query });
    setPollPageNumber(1);
    setType('list');
    setSortOption('updated.desc');
  }, [query]);

  const {
    content: contentLists,
    hasMore: listHasMore,
    loading: listLoading,
  } = useSearchRequest('/contentlists', listParams, listPageNumber);

  const {
    content: polls,
    hasMore: pollsHasMore,
    loading: pollsLoading,
  } = useSearchRequest('/polls', pollParams, pollPageNumber);

  useEffect(() => {
    if (contentLists.length) {
      console.debug('contentLists:', contentLists);
    }
  }, [contentLists]);

  useEffect(() => {
    if (polls.length) {
      console.debug('polls:', polls);
    }
  }, [polls]);

  const handleSortOption = (sort) => {
    if (sortOption !== sort) {
      setSortOption(sort);
    }
    setShowSortOptions(false);
  };

  return (
    <Container>
      <Filters>
        <FiltersLeft>
          <div
            className={type === 'list' ? 'active' : ''}
            onClick={() => setType('list')}
          >
            Listas
          </div>
          <div
            className={type === 'poll' ? 'active' : ''}
            onClick={() => setType('poll')}
          >
            Votações
          </div>
        </FiltersLeft>
        <FiltersRight>
          <label>Classificar por</label>
          <SingleOptionSelect
            label={!sortOption ? 'Selecione' : getSortOption(sortOption)}
            dropDownAlign="center"
            show={showSortOptions}
            setShow={setShowSortOptions}
            width="155px"
            background={colors['background-600']}
            hover={colors['background-700']}
          >
            <SortOptions>
              <Option onClick={() => handleSortOption('updated.desc')}>
                Atualização (novo)
              </Option>
              <Option onClick={() => handleSortOption('updated.asc')}>
                Atualização (antigo)
              </Option>
              <Option onClick={() => handleSortOption('popularity.desc')}>
                Popularidade (maior)
              </Option>
              <Option onClick={() => handleSortOption('popularity.asc')}>
                Popularidade (menor)
              </Option>
              <Option onClick={() => handleSortOption('rating.desc')}>
                Avaliação (melhor)
              </Option>
              <Option onClick={() => handleSortOption('rating.asc')}>
                Avaliação (pior)
              </Option>
              <Option onClick={() => handleSortOption('title.asc')}>
                Título (A-Z)
              </Option>
              <Option onClick={() => handleSortOption('title.desc')}>
                Título (Z-A)
              </Option>
            </SortOptions>
          </SingleOptionSelect>
        </FiltersRight>
      </Filters>
      <Main>
        <SearchItems>
          {type === 'list' &&
            contentLists.map((list) => (
              <SearchItem
                key={`list${list.id}`}
                onClick={() => history.push(`/lists/${list.id}`)}
              >
                <SearchCard
                  title={list.title}
                  description={list.description}
                  thumbnail={list.thumbnail}
                  userName={list.user_name}
                />
              </SearchItem>
            ))}
          {type === 'poll' &&
            polls.map((poll) => (
              <SearchItem
                key={`poll${poll.id}`}
                onClick={() => history.push(`/polls/${poll.id}`)}
              >
                <SearchCard
                  title={poll.title}
                  description={poll.description}
                  thumbnail={poll.thumbnail}
                  userName={poll.user_name}
                />
              </SearchItem>
            ))}
        </SearchItems>
      </Main>
    </Container>
  );
};

export default Search;
