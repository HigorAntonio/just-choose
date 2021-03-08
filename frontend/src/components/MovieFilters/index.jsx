import React, { useState, useEffect } from 'react';

import CustomSelect from '../CustomSelect';
import ContentProvider from '../ContentProvider';
import CustomOption from '../CustomOption';
import DataPicker from '../DataPicker';
import RangeSlider from '../RangeSlider';

import justChooseApi from '../../apis/justChooseApi';

import {
  Providers,
  Genres,
  ReleaseDate,
  DataPickerWrapper,
  RangeWrapper,
  Certification,
  SearchButton,
  ClearButton,
} from './styles';

const compareCertifications = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};

const MovieFilters = () => {
  const [providers, setProviders] = useState();
  const [genres, setGenres] = useState();
  const [certifications, setCertifications] = useState();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [releaseDateGte, setReleaseDateGte] = useState();
  const [releaseDateLte, setReleaseDateLte] = useState(new Date());
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [voteAverage, setVoteAverage] = useState([0, 10]);
  const [runtime, setRuntime] = useState([0, 400]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await justChooseApi.get('/movies/watch_providers');
        setProviders(data);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/genres');
        setGenres(data.genres);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/certifications');
        setCertifications(
          data.certifications['BR'].sort(compareCertifications)
        );
      } catch (error) {}
    })();
  }, [setProviders, setGenres, setCertifications]);

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

  const handleSearch = async () => {
    const orderedCertifications = selectedCertifications.sort((a, b) => a - b);
    const params = {};
    selectedProviders.length &&
      (params.with_watch_providers = selectedProviders.join(','));
    selectedGenres.length && (params.with_genres = selectedGenres.join(','));
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

    try {
      const { data } = await justChooseApi.get('/movies', { params });
      console.log(params);
      console.log(data);
    } catch (error) {}
  };

  return (
    <>
      <div>
        <label>Filtrar por</label>
        <CustomSelect label="Provedor" dropDownAlign="center">
          <Providers>
            {providers &&
              providers.map((p) => (
                <ContentProvider
                  key={p.id}
                  click={() => handleSelectProvider(p.id)}
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
                <CustomOption key={g.id} click={() => handleSelectGenre(g.id)}>
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
                >
                  {c.certification}
                </CustomOption>
              ))}
          </Certification>
        </CustomSelect>
        <CustomSelect label="Pontuação do usuário" dropDownAlign="center">
          <RangeWrapper>
            <span className="label-left">0</span>
            <RangeSlider
              min={0}
              max={10}
              step={1}
              value={voteAverage}
              setValue={setVoteAverage}
            />
            <span className="label-right">10</span>
          </RangeWrapper>
        </CustomSelect>
        <CustomSelect label="Duração" dropDownAlign="center">
          <RangeWrapper title="Duração em minutos">
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
          </RangeWrapper>
        </CustomSelect>
      </div>
      <div>
        <ClearButton onClick={handleSearch}>Limpar filtros</ClearButton>
        <SearchButton onClick={handleSearch}>Filtrar</SearchButton>
      </div>
    </>
  );
};

export default MovieFilters;
