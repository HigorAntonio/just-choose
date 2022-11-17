import React, { useState, useEffect, useRef } from 'react';
import { GoSearch } from 'react-icons/go';

import SingleOptionSelect from '../../../components/SingleOptionSelect';
import GameFilters from '../../../components/GameFilters';
import MovieFilters from '../../../components/MovieFilters';
import ShowFilters from '../../../components/ShowFilters';
import AvailableMovies from '../AvailableMovies';
import SearchMovies from '../SearchMovies';
import AvailableShows from '../AvailableShows';
import SearchShows from '../SearchShows';
import AvailableGames from '../AvailableGames';
import ListPreview from '../ListPreview';

import {
  Container,
  Header,
  Wrapper,
  ContentTypeWrapper,
  Label,
  Options,
  Option,
  SearchWrapper,
  SearchInput,
  ContentListWrapper,
} from './styles';

const AvailableContent = ({
  contentType,
  setContentType,
  contentList,
  setContentList,
  showListPreview,
  setShowListPreview,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [params, setParams] = useState({});
  const [contentTypesList] = useState(['Filme', 'Série', 'Jogo']);

  const mounted = useRef();
  const contentListWrapperRef = useRef();

  useEffect(() => {
    mounted.current = true;

    if (mounted.current) {
      setShowContent(false);
      setRequestType('');
      setParams({});
    }

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setParams({});
    if (contentType === 'Filme') {
      setRequestType('movie');
    } else if (contentType === 'Série') {
      setRequestType('show');
    } else if (contentType === 'Jogo') {
      setRequestType('game');
    }
  }, [contentType]);

  const handleContentType = (option) => {
    setContentType(option);
    setShowContent(false);
  };

  const handleSelectOnPressEnter = (e, cb, option) => {
    if (e.key === 'Enter') {
      cb(option);
      document.activeElement
        .closest('[data-select]')
        .querySelector('[data-select-button]')
        .focus();
    }
  };

  const handleContentInputEnterKey = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      if (contentType === 'Filme') {
        setRequestType('movie-search');
        setParams({ query: e.target.value });
      } else if (contentType === 'Série') {
        setRequestType('show-search');
        setParams({ query: e.target.value });
      } else if (contentType === 'Jogo') {
        setRequestType('game');
        setParams({ search: e.target.value });
      }
      setShowListPreview(false);
    }
  };

  return (
    <Container>
      <Header>
        <Wrapper>
          <ContentTypeWrapper>
            <Label>Tipo de conteúdo</Label>
            <SingleOptionSelect
              label={!contentType ? 'Selecionar' : contentType}
              dropDownAlign="left"
              show={showContent}
              setShow={setShowContent}
            >
              <Options minWidth={'120px'}>
                {contentTypesList.map((ct, i) => (
                  <Option
                    key={`contentTypesList${i}`}
                    onClick={() => {
                      handleContentType(ct);
                    }}
                    onKeyPress={(e) =>
                      handleSelectOnPressEnter(e, handleContentType, ct)
                    }
                    tabIndex="-1"
                    data-select-option
                  >
                    {ct}
                  </Option>
                ))}
              </Options>
            </SingleOptionSelect>
          </ContentTypeWrapper>
          {contentType && (
            <SearchWrapper>
              <SearchInput>
                <GoSearch size={'15px'} style={{ flexShrink: 0 }} />
                <input
                  type="search"
                  id="search"
                  placeholder="Buscar"
                  onKeyPress={handleContentInputEnterKey}
                />
              </SearchInput>
            </SearchWrapper>
          )}
        </Wrapper>
        {contentType === 'Filme' && (
          <Wrapper>
            <MovieFilters
              setParams={setParams}
              setRequestType={setRequestType}
              setShowListPreview={setShowListPreview}
            />
          </Wrapper>
        )}
        {contentType === 'Série' && (
          <Wrapper>
            <ShowFilters
              setParams={setParams}
              setRequestType={setRequestType}
              setShowListPreview={setShowListPreview}
            />
          </Wrapper>
        )}
        {contentType === 'Jogo' && (
          <Wrapper>
            <GameFilters
              setParams={setParams}
              setRequestType={setRequestType}
              setShowListPreview={setShowListPreview}
            />
          </Wrapper>
        )}
      </Header>
      {contentType && (
        <ContentListWrapper ref={contentListWrapperRef} tabIndex="-1">
          {!showListPreview && (
            <>
              {requestType === 'movie' && (
                <AvailableMovies
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
              {requestType === 'movie-search' && (
                <SearchMovies
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
              {requestType === 'show' && (
                <AvailableShows
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
              {requestType === 'show-search' && (
                <SearchShows
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
              {requestType === 'game' && (
                <AvailableGames
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
            </>
          )}
          {showListPreview && (
            <ListPreview
              contentList={contentList}
              setContentList={setContentList}
              wrapperRef={contentListWrapperRef}
            />
          )}
        </ContentListWrapper>
      )}
    </Container>
  );
};

export default AvailableContent;
