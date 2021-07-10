import React, { useState, useEffect, memo } from 'react';

import SingleOptionSelect from '../SingleOptionSelect';
import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import useShowFilters from '../../hooks/useShowFilters';

import {
  Providers,
  Genres,
  ReleaseDate,
  DataPickerWrapper,
  RangeWrapper,
  SearchButton,
  ClearButton,
  OrderByOptions,
  Option,
} from './styles';

const ShowFilters = ({
  setParams,
  setPageNumber,
  setRequestType,
  setShowListPreview,
}) => {
  const {
    sortByList,
    sortBy,
    setSortBy,
    providers,
    genres,
    selectedProviders,
    setSelectedProviders,
    selectedGenres,
    setSelectedGenres,
    airDateGte,
    setAirDateGte,
    airDateLte,
    setAirDateLte,
    voteAverage,
    setVoteAverage,
    runtime,
    setRuntime,
    clearFilters,
  } = useShowFilters();

  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSelectProvider = (id) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders((prevState) => prevState.filter((p) => p !== id));
    } else {
      setSelectedProviders((prevState) => [...prevState, id]);
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
    selectedProviders.length &&
      (params.with_watch_providers = selectedProviders.join('|'));
    selectedGenres.length && (params.with_genres = selectedGenres.join('|'));
    airDateGte && (params['first_air_date.gte'] = airDateGte);
    params['first_air_date.lte'] = airDateLte;
    params['vote_average.gte'] = voteAverage[0];
    params['vote_average.lte'] = voteAverage[1];
    params['with_runtime.gte'] = runtime[0];
    params['with_runtime.lte'] = runtime[1];
    params.sort_by = sortBy.value;

    return params;
  };

  const handleSearch = () => {
    setRequestType('show');
    setParams(sanitizeParams());
    setPageNumber(1);
    setShowListPreview(false);
  };

  useEffect(() => {
    setRequestType('show');
    setParams((prevState) => ({ ...prevState, sort_by: sortBy.value }));
    setPageNumber(1);
    setShowListPreview(false);
  }, [sortBy, setParams, setPageNumber, setRequestType, setShowListPreview]);

  const handleClearFilters = () => {
    setRequestType('show');
    clearFilters();
    setParams({});
    setPageNumber(1);
    setShowListPreview(false);
  };

  const isProviderCheck = (providerId) => {
    return selectedProviders.includes(providerId);
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
        <CustomSelect label="Provedor" dropDownAlign="center">
          <Providers>
            {providers &&
              providers.map((p) => (
                <ContentProvider
                  key={p.id}
                  click={() => handleSelectProvider(p.id)}
                  check={isProviderCheck(p.id)}
                >
                  {p.name}
                </ContentProvider>
              ))}
          </Providers>
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
                <DataPicker value={airDateGte} setValue={setAirDateGte} />
              </DataPickerWrapper>
            </div>
            <div>
              <span>até</span>
              <DataPickerWrapper>
                <DataPicker value={airDateLte} setValue={setAirDateLte} />
              </DataPickerWrapper>
            </div>
          </ReleaseDate>
        </CustomSelect>
        <CustomSelect label="Pontuação do usuário" dropDownAlign="center">
          <RangeWrapper>
            <div>
              <span className="label-left">0</span>
              <RangeSlider
                min={0}
                max={10}
                step={1}
                value={voteAverage}
                setValue={setVoteAverage}
              />
              <span className="label-right">10</span>
            </div>
          </RangeWrapper>
        </CustomSelect>
        <CustomSelect label="Duração" dropDownAlign="center">
          <RangeWrapper title="Duração em minutos">
            <div>
              <span className="label-left" title="0 minutos">
                0
              </span>
              <RangeSlider
                min={0}
                max={400}
                step={5}
                value={runtime}
                setValue={setRuntime}
              />
              <span className="label-right" title="400 minutos">
                400
              </span>
            </div>
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

export default memo(ShowFilters);
