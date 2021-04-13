import React, { useState, useEffect } from 'react';

import SingleOptionSelect from '../SingleOptionSelect';
import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import useMovieFilters from '../../hooks/useMovieFilters';

import {
  Providers,
  Genres,
  ReleaseDate,
  DataPickerWrapper,
  RangeWrapper,
  Certification,
  SearchButton,
  ClearButton,
  OrderByOptions,
  Option,
} from './styles';

const MovieFilters = ({
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
    certifications,
    selectedProviders,
    setSelectedProviders,
    selectedGenres,
    setSelectedGenres,
    releaseDateGte,
    setReleaseDateGte,
    releaseDateLte,
    setReleaseDateLte,
    selectedCertifications,
    setSelectedCertifications,
    voteAverage,
    setVoteAverage,
    runtime,
    setRuntime,
    clearFilters,
  } = useMovieFilters();

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

  const handleSelectCertification = (order) => {
    if (selectedCertifications.includes(order)) {
      setSelectedCertifications((prevState) =>
        prevState.filter((c) => c !== order)
      );
    } else {
      setSelectedCertifications((prevState) => [...prevState, order]);
    }
  };

  const sanitizeParams = () => {
    const params = {};
    const orderedCertifications = selectedCertifications.sort((a, b) => a - b);
    selectedProviders.length &&
      (params.with_watch_providers = selectedProviders.join('|'));
    selectedGenres.length && (params.with_genres = selectedGenres.join('|'));
    releaseDateGte && (params['primary_release_date.gte'] = releaseDateGte);
    params['primary_release_date.lte'] = releaseDateLte;
    orderedCertifications.length &&
      (params['certification.gte'] = certifications.filter(
        (c) => c.order === orderedCertifications[0]
      )[0].certification);
    orderedCertifications.length &&
      (params['certification.lte'] = certifications.filter(
        (c) =>
          c.order === orderedCertifications[orderedCertifications.length - 1]
      )[0].certification);
    params['vote_average.gte'] = voteAverage[0];
    params['vote_average.lte'] = voteAverage[1];
    params['with_runtime.gte'] = runtime[0];
    params['with_runtime.lte'] = runtime[1];
    params.sort_by = sortBy.value;

    return params;
  };

  const handleSearch = () => {
    setRequestType('movie');
    setParams(sanitizeParams());
    setPageNumber(1);
    setShowListPreview(false);
  };

  useEffect(() => {
    setRequestType('movie');
    setParams((prevState) => ({ ...prevState, sort_by: sortBy.value }));
    setPageNumber(1);
    setShowListPreview(false);
  }, [sortBy, setParams, setPageNumber, setRequestType, setShowListPreview]);

  const handleClearFilters = () => {
    setRequestType('movie');
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

  const isCertificationCheck = (order) => {
    return selectedCertifications.includes(order);
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
        <CustomSelect label="Classificação indicativa" dropDownAlign="center">
          <Certification>
            {certifications &&
              certifications.map((c) => (
                <CustomOption
                  key={c.order}
                  click={() => handleSelectCertification(c.order)}
                  check={isCertificationCheck(c.order)}
                >
                  {c.certification}
                </CustomOption>
              ))}
          </Certification>
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

export default MovieFilters;
