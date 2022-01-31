import { useState, useEffect } from 'react';
import axios from 'axios';

import justChooseApi from '../services/justChooseApi';

const useShowFilters = () => {
  const [sortBy, setSortBy] = useState({
    key: 'Popularidade (maior)',
    value: 'popularity.desc',
  });
  const [providers, setProviders] = useState();
  const [genres, setGenres] = useState();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [airDateGte, setAirDateGte] = useState();
  const [airDateLte, setAirDateLte] = useState(new Date());
  const [voteAverage, setVoteAverage] = useState([0, 10]);
  const [runtime, setRuntime] = useState([0, 400]);

  const sortByList = [
    { key: 'Popularidade (maior)', value: 'popularity.desc' },
    { key: 'Popularidade (menor)', value: 'popularity.asc' },
    { key: 'Avaliação (melhor)', value: 'vote_average.desc' },
    { key: 'Avaliação (pior)', value: 'vote_average.asc' },
    { key: 'Lançamento (novo)', value: 'first_air_date.desc' },
    { key: 'Lançamento (antigo)', value: 'first_air_date.asc' },
    { key: 'Título (A-Z)', value: 'original_title.asc' },
    { key: 'Título (Z-A)', value: 'original_title.desc' },
  ];

  const clearFilters = () => {
    setSelectedProviders([]);
    setSelectedGenres([]);
    setAirDateGte(null);
    setAirDateLte(new Date());
    setVoteAverage([0, 10]);
    setRuntime([0, 400]);
    setSortBy({ key: 'Popularidade (maior)', value: 'popularity.desc' });
  };

  useEffect(() => {
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/shows/watch_providers', {
          cancelToken: source.token,
        });
        setProviders(data);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/shows/genres', {
          cancelToken: source.token,
        });
        setGenres(data.genres);
      } catch (error) {}
    })();

    return () => {
      source.cancel();
    };
  }, [setProviders, setGenres]);

  return {
    sortByList,
    sortBy,
    setSortBy,
    providers,
    setProviders,
    genres,
    setGenres,
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
  };
};

export default useShowFilters;
