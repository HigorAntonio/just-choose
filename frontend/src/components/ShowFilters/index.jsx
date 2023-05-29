import React, { useState, useEffect, useContext, memo } from 'react';

import SingleOptionSelect from '../SingleOptionSelect';
import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import { ViewportContext } from '../../context/ViewportContext';
import useShowFilters from '../../hooks/useShowFilters';
import breakpoints from '../../styles/breakpoints';

import {
  Container,
  FilterWrapper,
  FilterGrid,
  ButtonsWrapper,
  LabelWrapper,
  Label,
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

const ShowFilters = ({ setParams, setRequestType, setShowListPreview }) => {
  const {
    sortByList,
    sortBy,
    setSortBy,
    isFetchingProviders,
    providers,
    isFetchingGenres,
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
  const { width } = useContext(ViewportContext);

  const handleSelectSortBy = (sb) => {
    sortBy.value !== sb.value && setSortBy(sb);
    setShowSortOptions(false);
  };

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
    setShowListPreview(false);
  };

  useEffect(() => {
    setRequestType('show');
    setParams((prevState) => ({ ...prevState, sort_by: sortBy.value }));
    setShowListPreview(false);
  }, [sortBy, setParams, setRequestType, setShowListPreview]);

  const handleClearFilters = () => {
    setRequestType('show');
    clearFilters();
    setParams({});
    setShowListPreview(false);
  };

  const isProviderCheck = (providerId) => {
    return selectedProviders.includes(providerId);
  };

  const isGenreCheck = (genreId) => {
    return selectedGenres.includes(genreId);
  };

  return (
    <Container>
      <FilterWrapper>
        <LabelWrapper>
          <Label>Ordenar por</Label>
        </LabelWrapper>
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
              label="Provedor"
              dropDownAlign={
                width <= breakpoints.getInt(breakpoints.size4) &&
                width > breakpoints.getInt(breakpoints.size3)
                  ? 'left'
                  : 'center'
              }
            >
              <Providers>
                {providers?.results?.map((provider) => (
                  <ContentProvider
                    key={provider.id}
                    click={() => handleSelectProvider(provider.id)}
                    check={isProviderCheck(provider.id)}
                    onKeyPress={(e) =>
                      handleMultipleSelectOnPressEnter(
                        e,
                        handleSelectProvider,
                        provider.id
                      )
                    }
                    tabIndex="-1"
                    data-select-option
                  >
                    {provider.name}
                  </ContentProvider>
                ))}
              </Providers>
            </CustomSelect>
            <CustomSelect label="Gênero" dropDownAlign="center">
              <Genres>
                {genres?.results?.map((genre) => (
                  <CustomOption
                    key={genre.id}
                    click={() => handleSelectGenre(genre.id)}
                    check={isGenreCheck(genre.id)}
                    onKeyPress={(e) =>
                      handleMultipleSelectOnPressEnter(
                        e,
                        handleSelectGenre,
                        genre.id
                      )
                    }
                    tabIndex="-1"
                    data-select-option
                  >
                    {genre.name}
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

export default memo(ShowFilters);
