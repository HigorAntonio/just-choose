import { useContext } from 'react';
import { useQuery as useReactQuery } from 'react-query';

import { AuthContext } from '../context/AuthContext';

const useQuery = (queryKey, axiosGetFn, options) => {
  const { setAuthentication } = useContext(AuthContext);

  const queryFn = async () => {
    try {
      return await axiosGetFn();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message &&
        (error.response.data.message === 'invalid "refresh_token"' ||
          error.response.data.message === 'invalid "access_token"')
      ) {
        setAuthentication(null);
      }
      throw error;
    }
  };

  const queryResult = useReactQuery(queryKey, queryFn, options);

  return queryResult;
};

export default useQuery;
