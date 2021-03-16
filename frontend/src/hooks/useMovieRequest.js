import { useEffect, useState } from 'react';
import axios from 'axios';

import justChooseApi from '../apis/justChooseApi';

const useMovieRequest = ({ params }) => {
  useEffect(() => {
    let cancel;
    (async () => {
      try {
        const { data } = await justChooseApi.get('/movies', {
          params,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
      }
    })();
  }, []);
};

export default useMovieRequest;
