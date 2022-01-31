import { useState, useEffect } from 'react';
import axios from 'axios';

import justChooseApi from '../services/justChooseApi';

const useGameFilters = () => {
  const [sortBy, setSortBy] = useState({
    key: 'Popularidade (maior)',
    value: '-added',
  });
  const [platforms, setPlatforms] = useState();
  const [genres, setGenres] = useState();
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

  useEffect(() => {
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/games/platforms', {
          cancelToken: source.token,
        });
        setPlatforms(data.platforms);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/games/genres', {
          cancelToken: source.token,
        });
        setGenres(data.genres);
      } catch (error) {}
    })();

    return () => {
      source.cancel();
    };
  }, [setPlatforms, setGenres]);

  return {
    sortByList,
    sortBy,
    setSortBy,
    platforms,
    setPlatforms,
    genres,
    setGenres,
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
