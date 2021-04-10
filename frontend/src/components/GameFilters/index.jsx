import React, { useState, useEffect } from 'react';

import SingleOptionSelect from '../SingleOptionSelect';
import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import useGameFilters from '../../hooks/useGameFilters';

import {
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

const GameFilters = ({ setParams, setPageNumber, setRequestType }) => {
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
    params.metacritic = `${metacritic[0] === 0 ? 1 : metacritic[0]},${
      metacritic[1] === 0 ? 1 : metacritic[1]
    }`;
    params.ordering = sortBy.value;

    return params;
  };

  const handleSearch = () => {
    setRequestType('game');
    setParams(sanitizeParams());
    setPageNumber(1);
  };

  useEffect(() => {
    setRequestType('game');
    setParams((prevState) => ({ ...prevState, ordering: sortBy.value }));
    setPageNumber(1);
  }, [sortBy, setParams, setPageNumber, setRequestType]);

  const handleClearFilters = () => {
    setRequestType('game');
    clearFilters();
    setParams({});
    setPageNumber(1);
  };

  const isPlatformCheck = (providerId) => {
    return selectedPlatforms.includes(providerId);
  };

  const isGenreCheck = (genreId) => {
    return selectedGenres.includes(genreId);
  };

  return (
    <>
      <div>
        <label>Ordenar por</label>
        <SingleOptionSelect
          label={!sortBy.key ? 'Selecionar' : sortBy.key}
          dropDownAlign="center"
          show={showSortOptions}
          setShow={setShowSortOptions}
          width="155px"
        >
          <OrderByOptions>
            {sortByList.map((sb, i) => (
              <Option
                key={`movieOrderByList${i}`}
                onClick={() => {
                  sortBy.value !== sb.value && setSortBy(sb);
                  setShowSortOptions(false);
                }}
              >
                {sb.key}
              </Option>
            ))}
          </OrderByOptions>
        </SingleOptionSelect>
      </div>
      <div>
        <label>Filtrar por</label>
        <CustomSelect label="Plataforma" dropDownAlign="center">
          <Platforms>
            {platforms &&
              platforms.map((p) => (
                <ContentProvider
                  key={p.id}
                  click={() => handleSelectPlatform(p.id)}
                  check={isPlatformCheck(p.id)}
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
            <span className="label-left">0</span>
            <RangeSlider
              min={0}
              max={100}
              step={1}
              value={metacritic}
              setValue={setMetacritic}
            />
            <span className="label-right">100</span>
          </RangeWrapper>
        </CustomSelect>
        <div>
          <ClearButton onClick={handleClearFilters}>Reinicializar</ClearButton>
          <SearchButton onClick={handleSearch}>Filtrar</SearchButton>
        </div>
      </div>
    </>
  );
};

export default GameFilters;
