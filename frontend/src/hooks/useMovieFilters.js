import { useState, useEffect } from 'react';

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

  const clearFilters = () => {
    setSelectedProviders([]);
    setSelectedGenres([]);
    setReleaseDateGte(null);
    setReleaseDateLte(new Date());
    setSelectedCertifications([]);
    setVoteAverage([0, 10]);
    setRuntime([0, 400]);
  };

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

  return {
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
