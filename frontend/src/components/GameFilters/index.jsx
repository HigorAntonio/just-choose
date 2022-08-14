import React, { useState, useEffect, useContext, memo } from 'react';

import SingleOptionSelect from '../SingleOptionSelect';
import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import { ViewportContext } from '../../context/ViewportContext';
import useGameFilters from '../../hooks/useGameFilters';
import breakpoints from '../../styles/breakpoints';

import {
  Container,
  FilterWrapper,
  FilterGrid,
  ButtonsWrapper,
  LabelWrapper,
  Label,
  Platforms,
  Genres,
  ReleaseDate,
  DataPickerWrapper,
  RangeWrapper,
  SearchButton,
  ClearButton,
  OrderByOptions,
  Option,
} from './styles';

const GameFilters = ({ setParams, setRequestType, setShowListPreview }) => {
  const {
    sortByList,
    sortBy,
    setSortBy,
    platforms,
    genres,
    selectedPlatforms,
    setSelectedPlatforms,
    selectedGenres,
    setSelectedGenres,
    releaseDateGte,
    setReleaseDateGte,
    releaseDateLte,
    setReleaseDateLte,
    metacritic,
    setMetacritic,
    clearFilters,
  } = useGameFilters();

  const [showSortOptions, setShowSortOptions] = useState(false);
  const { width } = useContext(ViewportContext);

  const handleSelectSortBy = (sb) => {
    sortBy.value !== sb.value && setSortBy(sb);
    setShowSortOptions(false);
  };

  const handleSelectPlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms((prevState) => prevState.filter((p) => p !== id));
    } else {
      setSelectedPlatforms((prevState) => [...prevState, id]);
    }
  };

  const handleSelectGenre = (id) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres((prevState) => prevState.filter((p) => p !== id));
    } else {
      setSelectedGenres((prevState) => [...prevState, id]);
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

  const handleMultipleSelectOnPressEnter = (e, cb, option) => {
    if (e.key === 'Enter') {
      cb(option);
    }
  };

  const sanitizeParams = () => {
    const params = {};
    selectedPlatforms.length &&
      (params.platforms = selectedPlatforms.join(','));
    selectedGenres.length && (params.genres = selectedGenres.join(','));
    releaseDateGte &&
      (params.dates =
        releaseDateGte.toISOString().split('T')[0] +
        ',' +
        releaseDateLte.toISOString().split('T')[0]);
    (metacritic[0] !== 0 || metacritic[1] !== 100) &&
      (params.metacritic = `${metacritic[0] === 0 ? 1 : metacritic[0]},${
        metacritic[1] === 0 ? 1 : metacritic[1]
      }`);
    params.ordering = sortBy.value;

    return params;
  };

  const handleSearch = () => {
    setRequestType('game');
    setParams(sanitizeParams());
    setShowListPreview(false);
  };

  useEffect(() => {
    setRequestType('game');
    setParams((prevState) => ({ ...prevState, ordering: sortBy.value }));
    setShowListPreview(false);
  }, [sortBy, setParams, setRequestType, setShowListPreview]);

  const handleClearFilters = () => {
    setRequestType('game');
    clearFilters();
    setParams({});
    setShowListPreview(false);
  };

  const isPlatformCheck = (providerId) => {
    return selectedPlatforms.includes(providerId);
  };

  const isGenreCheck = (genreId) => {
    return selectedGenres.includes(genreId);
  };

  return (
    <Container>
      <FilterWrapper>
        <Label>Ordenar por</Label>
        <SingleOptionSelect
          label={!sortBy.key ? 'Selecionar' : sortBy.key}
          dropDownAlign="center"
          show={showSortOptions}
          setShow={setShowSortOptions}
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
      </FilterWrapper>
      <FilterWrapper className="space-beetween">
        <FilterWrapper className="filter-grid-wrapper">
          <LabelWrapper>
            <Label>Filtrar por</Label>
          </LabelWrapper>
          <FilterGrid>
            <CustomSelect
              label="Plataforma"
              dropDownAlign={
                width <= breakpoints.getInt(breakpoints.size5) &&
                width > breakpoints.getInt(breakpoints.size3)
                  ? 'left'
                  : 'center'
              }
            >
              <Platforms>
                {platforms &&
                  platforms.map((p) => (
                    <ContentProvider
                      key={p.id}
                      click={() => handleSelectPlatform(p.id)}
                      check={isPlatformCheck(p.id)}
                      onKeyPress={(e) =>
                        handleMultipleSelectOnPressEnter(
                          e,
                          handleSelectPlatform,
                          p.id
                        )
                      }
                      tabIndex="-1"
                      data-select-option
                    >
                      {p.name}
                    </ContentProvider>
                  ))}
              </Platforms>
            </CustomSelect>
            <CustomSelect label="Gênero" dropDownAlign="center">
              <Genres>
                {genres &&
                  genres.map((g) => (
                    <CustomOption
                      key={g.id}
                      click={() => handleSelectGenre(g.id)}
                      check={isGenreCheck(g.id)}
                      onKeyPress={(e) =>
                        handleMultipleSelectOnPressEnter(
                          e,
                          handleSelectGenre,
                          g.id
                        )
                      }
                      tabIndex="-1"
                      data-select-option
                    >
                      {g.name}
                    </CustomOption>
                  ))}
              </Genres>
            </CustomSelect>
            <CustomSelect label="Data de lançamento" dropDownAlign="center">
              <ReleaseDate>
                <div>
                  <span>de</span>
                  <DataPickerWrapper>
                    <DataPicker
                      value={releaseDateGte}
                      setValue={setReleaseDateGte}
                    />
                  </DataPickerWrapper>
                </div>
                <div>
                  <span>até</span>
                  <DataPickerWrapper>
                    <DataPicker
                      value={releaseDateLte}
                      setValue={setReleaseDateLte}
                    />
                  </DataPickerWrapper>
                </div>
              </ReleaseDate>
            </CustomSelect>
            <CustomSelect label="Metacritic" dropDownAlign="center">
              <RangeWrapper>
                <div>
                  <span className="label-left">0</span>
                  <RangeSlider
                    min={0}
                    max={100}
                    step={1}
                    value={metacritic}
                    setValue={setMetacritic}
                  />
                  <span className="label-right">100</span>
                </div>
              </RangeWrapper>
            </CustomSelect>
          </FilterGrid>
        </FilterWrapper>
        <ButtonsWrapper>
          <ClearButton onClick={handleClearFilters}>Reinicializar</ClearButton>
          <SearchButton onClick={handleSearch}>Filtrar</SearchButton>
        </ButtonsWrapper>
      </FilterWrapper>
    </Container>
  );
};

export default memo(GameFilters);
