import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { Link, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import queryString from 'query-string';

import useSearchRequest from '../../hooks/useSearchRequest';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import SearchCard from '../../components/SeachCard';
import SearchNotFound from '../../components/SearchNotFound';

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

const getSortOption = (option) => {
  switch (option) {
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
  const location = useLocation();
  const { query, type } = queryString.parse(location.search);
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const { colors } = useContext(ThemeContext);

  const [listParams, setListParams] = useState({});
  const [listPageNumber, setListPageNumber] = useState(1);
  const [pollParams, setPollParams] = useState({});
  const [pollPageNumber, setPollPageNumber] = useState(1);
  const [profileParams, setProfileParams] = useState({});
  const [profilePageNumber, setProfilePageNumber] = useState(1);
  const [showListSortOptions, setShowListSortOptions] = useState(false);
  const [showPollSortOptions, setShowPollSortOptions] = useState(false);
  const [showListOption, setShowListOption] = useState(false);
  const [showPollOption, setShowPollOption] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);

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

  const {
    content: profiles,
    hasMore: profilesHasMore,
    loading: profilesLoading,
  } = useSearchRequest('/users', profileParams, profilePageNumber);

  useEffect(() => {
    setListParams({ query, sort_by: 'updated.desc' });
    setListPageNumber(1);
    setPollParams({ query, sort_by: 'updated.desc' });
    setPollPageNumber(1);
    setProfileParams({ query, sort_by: 'updated.desc' });
    setProfilePageNumber(1);
  }, [query]);

  useEffect(() => {
    setShowListOption(contentLists.length > 0);

    setShowPollOption(polls.length > 0);

    setShowProfileOption(profiles.length > 0);

    if (type === 'list' && contentLists.length === 0 && !listLoading) {
      history.replace(`${path}?query=${query}&type=poll`);
      setShowListOption(false);
    }
    if (type === 'poll' && polls.length === 0 && !pollsLoading) {
      history.replace(`${path}?query=${query}&type=profile`);
      setShowPollOption(false);
    }
    if (type === 'profile' && profiles.length === 0 && !profilesLoading) {
      history.replace(`${path}?query=${query}`);
      setShowProfileOption(false);
    }
  }, [
    type,
    contentLists,
    polls,
    profiles,
    history,
    path,
    query,
    listLoading,
    pollsLoading,
    profilesLoading,
  ]);

  useEffect(() => {
    if (type !== 'list' && type !== 'poll' && type !== 'profile') {
      history.replace(`${path}?query=${query}`);
    }
  }, [type, path, query, history]);

  useEffect(() => {
    if (!type && showListOption) {
      history.replace(`${path}?query=${query}&type=list`);
    }
  }, [type, showListOption, history, path, query]);

  useEffect(() => {
    if (!type && showPollOption && !showListOption) {
      history.replace(`${path}?query=${query}&type=poll`);
    }
  }, [type, showListOption, showPollOption, history, path, query]);

  useEffect(() => {
    if (!type && showProfileOption && !showPollOption && !showListOption) {
      history.replace(`${path}?query=${query}&type=profile`);
    }
  }, [
    type,
    showListOption,
    showPollOption,
    showProfileOption,
    history,
    path,
    query,
  ]);

  const handleListSortOption = (option) => {
    if (listParams.sort_by !== option) {
      setListParams((prevState) => ({ ...prevState, sort_by: option }));
      setListPageNumber(1);
    }
    setShowListSortOptions(false);
  };

  const handlePollSortOption = (option) => {
    if (pollParams.sort_by !== option) {
      setPollParams((prevState) => ({ ...prevState, sort_by: option }));
      setPollPageNumber(1);
    }
    setShowPollSortOptions(false);
  };

  const listsObserver = useRef();
  const lastListRef = useCallback(
    (node) => {
      if (listLoading) {
        return;
      }
      if (listsObserver.current) {
        listsObserver.current.disconnect();
      }
      listsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && listHasMore) {
          setListPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        listsObserver.current.observe(node);
      }
    },
    [listLoading, listHasMore, setListPageNumber]
  );

  const pollsObserver = useRef();
  const lastPollRef = useCallback(
    (node) => {
      if (pollsLoading) {
        return;
      }
      if (pollsObserver.current) {
        pollsObserver.current.disconnect();
      }
      pollsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pollsHasMore) {
          setPollPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        pollsObserver.current.observe(node);
      }
    },
    [pollsLoading, pollsHasMore, setPollPageNumber]
  );

  const profilesObserver = useRef();
  const lastProfileRef = useCallback(
    (node) => {
      if (profilesLoading) {
        return;
      }
      if (profilesObserver.current) {
        profilesObserver.current.disconnect();
      }
      profilesObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && profilesHasMore) {
          setProfilePageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        profilesObserver.current.observe(node);
      }
    },
    [profilesLoading, profilesHasMore, setProfilePageNumber]
  );

  return (
    <Container>
      {contentLists.length === 0 &&
      !listLoading &&
      polls.length === 0 &&
      !pollsLoading &&
      profiles.length === 0 &&
      !profilesLoading ? (
        <SearchNotFound />
      ) : (
        <>
          {(showListOption || showPollOption || showProfileOption) && (
            <Filters>
              <FiltersLeft>
                {showListOption && (
                  <div className={type === 'list' ? 'active' : ''}>
                    <Link to={`${url}?query=${query}&type=list`}>Listas</Link>
                  </div>
                )}
                {showPollOption && (
                  <div className={type === 'poll' ? 'active' : ''}>
                    <Link to={`${url}?query=${query}&type=poll`}>Votações</Link>
                  </div>
                )}
                {showProfileOption && (
                  <div className={type === 'profile' ? 'active' : ''}>
                    <Link to={`${url}?query=${query}&type=profile`}>
                      Perfis
                    </Link>
                  </div>
                )}
              </FiltersLeft>
              <FiltersRight>
                {type === 'list' && contentLists.length > 0 && (
                  <>
                    <label>Classificar por</label>
                    <SingleOptionSelect
                      label={
                        !listParams.sort_by
                          ? 'Selecione'
                          : getSortOption(listParams.sort_by)
                      }
                      dropDownAlign="center"
                      show={showListSortOptions}
                      setShow={setShowListSortOptions}
                      width="155px"
                      background={colors['background-600']}
                      hover={colors['background-700']}
                    >
                      <SortOptions>
                        <Option
                          onClick={() => handleListSortOption('updated.desc')}
                        >
                          Atualização (novo)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('updated.asc')}
                        >
                          Atualização (antigo)
                        </Option>
                        <Option
                          onClick={() =>
                            handleListSortOption('popularity.desc')
                          }
                        >
                          Popularidade (maior)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('popularity.asc')}
                        >
                          Popularidade (menor)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('rating.desc')}
                        >
                          Avaliação (melhor)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('rating.asc')}
                        >
                          Avaliação (pior)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('title.asc')}
                        >
                          Título (A-Z)
                        </Option>
                        <Option
                          onClick={() => handleListSortOption('title.desc')}
                        >
                          Título (Z-A)
                        </Option>
                      </SortOptions>
                    </SingleOptionSelect>
                  </>
                )}
                {type === 'poll' && polls.length > 0 && (
                  <>
                    <label>Classificar por</label>
                    <SingleOptionSelect
                      label={
                        !pollParams.sort_by
                          ? 'Selecione'
                          : getSortOption(pollParams.sort_by)
                      }
                      dropDownAlign="center"
                      show={showPollSortOptions}
                      setShow={setShowPollSortOptions}
                      width="155px"
                      background={colors['background-600']}
                      hover={colors['background-700']}
                    >
                      <SortOptions>
                        <Option
                          onClick={() => handlePollSortOption('updated.desc')}
                        >
                          Atualização (novo)
                        </Option>
                        <Option
                          onClick={() => handlePollSortOption('updated.asc')}
                        >
                          Atualização (antigo)
                        </Option>
                        <Option
                          onClick={() => handlePollSortOption('title.asc')}
                        >
                          Título (A-Z)
                        </Option>
                        <Option
                          onClick={() => handlePollSortOption('title.desc')}
                        >
                          Título (Z-A)
                        </Option>
                      </SortOptions>
                    </SingleOptionSelect>
                  </>
                )}
              </FiltersRight>
            </Filters>
          )}
          <Main>
            <SearchItems>
              {type === 'list' &&
                contentLists.map((list, i) => {
                  if (contentLists.length === i + 1) {
                    return (
                      <SearchItem
                        ref={lastListRef}
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
                    );
                  }
                  return (
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
                  );
                })}
              {type === 'poll' &&
                polls.map((poll, i) => {
                  if (polls.length === i + 1) {
                    return (
                      <SearchItem
                        ref={lastPollRef}
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
                    );
                  }
                  return (
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
                  );
                })}
              {type === 'profile' &&
                profiles.map((profile, i) => {
                  if (profiles.length === i + 1) {
                    return (
                      <SearchItem
                        ref={lastProfileRef}
                        key={`profile${profile.id}`}
                        onClick={() => {
                          alert(`${profile.name}`);
                        }}
                      >
                        <SearchCard
                          title={profile.name}
                          thumbnail={profile.profile_image_url}
                          roundedThumbnail
                        />
                      </SearchItem>
                    );
                  }
                  return (
                    <SearchItem
                      key={`profile${profile.id}`}
                      onClick={() => {
                        alert(`${profile.name}`);
                      }}
                    >
                      <SearchCard
                        title={profile.name}
                        thumbnail={profile.profile_image_url}
                        roundedThumbnail
                      />
                    </SearchItem>
                  );
                })}
            </SearchItems>
          </Main>
        </>
      )}
    </Container>
  );
};

export default Search;
