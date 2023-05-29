import { useState } from 'react';

import justChooseApi from '../services/justChooseApi';
import useQuery from './useQuery';

const useMovieFilters = () => {
  const [sortBy, setSortBy] = useState({
    key: 'Popularidade (maior)',
    value: 'popularity.desc',
  });
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

  const { isFetching: isFetchingProviders, data: providers } = useQuery(
    'useMovieFilters/movies/watch_providers',
    async () => {
      const response = await justChooseApi.get('/movies/watch_providers');
      return response.data;
    }
  );

  const { isFetching: isFetchingGenres, data: genres } = useQuery(
    'useMovieFilters/movies/genres',
    async () => {
      const response = await justChooseApi.get('/movies/genres');
      return response.data;
    }
  );

  const { isFetching: isFetchingCertifications, data: certifications } =
    useQuery('useMovieFilters/movies/certifications', async () => {
      const response = await justChooseApi.get('/movies/certifications');
      return response.data;
    });

  return {
    sortByList,
    sortBy,
    setSortBy,
    isFetchingProviders,
    providers,
    isFetchingGenres,
    genres,
    isFetchingCertifications,
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
  };
};

export default useMovieFilters;
