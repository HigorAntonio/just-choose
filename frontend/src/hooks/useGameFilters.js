import { useState } from 'react';

import justChooseApi from '../services/justChooseApi';
import useQuery from './useQuery';

const useGameFilters = () => {
  const [sortBy, setSortBy] = useState({
    key: 'Popularidade (maior)',
    value: '-added',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [releaseDateGte, setReleaseDateGte] = useState();
  const [releaseDateLte, setReleaseDateLte] = useState(new Date());
  const [metacritic, setMetacritic] = useState([0, 100]);

  const sortByList = [
    { key: 'Popularidade (maior)', value: '-added' },
    { key: 'Popularidade (menor)', value: 'added' },
    { key: 'Avaliação (melhor)', value: '-rating' },
    { key: 'Avaliação (pior)', value: 'rating' },
    { key: 'Lançamento (novo)', value: '-released' },
    { key: 'Lançamento (antigo)', value: 'released' },
    { key: 'Título (A-Z)', value: 'name' },
    { key: 'Título (Z-A)', value: '-name' },
    { key: 'Metacritic (melhor)', value: '-metacritic' },
    { key: 'Metacritic (pior)', value: 'metacritic' },
  ];

  const clearFilters = () => {
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setReleaseDateGte(null);
    setReleaseDateLte(new Date());
    setMetacritic([0, 100]);
    setSortBy({ key: 'Popularidade (maior)', value: '-added' });
  };

  const { isFetching: isFetchingPlatforms, data: platforms } = useQuery(
    'useGameFilters/games/platforms',
    async () => {
      const response = await justChooseApi.get('/games/platforms');
      return response.data;
    }
  );

  const { isFetching: isFetchingGenres, data: genres } = useQuery(
    'useGameFilters/games/genres',
    async () => {
      const response = await justChooseApi.get('/games/genres');
      return response.data;
    }
  );

  return {
    sortByList,
    sortBy,
    setSortBy,
    isFetchingPlatforms,
    platforms,
    isFetchingGenres,
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
  };
};

export default useGameFilters;
