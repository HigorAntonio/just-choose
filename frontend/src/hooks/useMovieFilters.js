import { useState, useEffect } from 'react';
import axios from 'axios';

import justChooseApi from '../apis/justChooseApi';

const compareCertifications = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};

const useMovieFilters = () => {
  const [sortBy, setSortBy] = useState({
    key: 'Popularidade (maior)',
    value: 'popularity.desc',
  });
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

  const sortByList = [
    { key: 'Popularidade (maior)', value: 'popularity.desc' },
    { key: 'Popularidade (menor)', value: 'popularity.asc' },
    { key: 'Avaliação (melhor)', value: 'vote_average.desc' },
    { key: 'Avaliação (pior)', value: 'vote_average.asc' },
    { key: 'Lançamento (novo)', value: 'primary_release_date.desc' },
    { key: 'Lançamento (antigo)', value: 'primary_release_date.asc' },
    { key: 'Título (A-Z)', value: 'original_title.asc' },
    { key: 'Título (Z-A)', value: 'original_title.desc' },
  ];

  const clearFilters = () => {
    setSelectedProviders([]);
    setSelectedGenres([]);
    setReleaseDateGte(null);
    setReleaseDateLte(new Date());
    setSelectedCertifications([]);
    setVoteAverage([0, 10]);
    setRuntime([0, 400]);
    setSortBy({ key: 'Popularidade (maior)', value: 'popularity.desc' });
  };

  useEffect(() => {
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/movies/watch_providers', {
          cancelToken: source.token,
        });
        setProviders(data);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/genres', {
          cancelToken: source.token,
        });
        setGenres(data.genres);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/certifications', {
          cancelToken: source.token,
        });
        setCertifications(
          data.certifications['BR'].sort(compareCertifications)
        );
      } catch (error) {}
    })();

    return () => {
      source.cancel();
    };
  }, [setProviders, setGenres, setCertifications]);

  return {
    sortByList,
    sortBy,
    setSortBy,
    providers,
    setProviders,
    genres,
    setGenres,
    certifications,
    setCertifications,
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
  };
};

export default useMovieFilters;
