import { useContext } from 'react';
import { useMutation as useReactQueryMutation } from 'react-query';

import { AuthContext } from '../context/AuthContext';

const useMutation = (axiosMutationFn, options) => {
  const { setAuthentication } = useContext(AuthContext);

  const mutationFn = async (...params) => {
    try {
      return await axiosMutationFn(...params);
    } catch (error) {
      if (
        error?.response?.data?.message === 'invalid "refresh_token"' ||
        error?.response?.data?.message === 'invalid "access_token"'
      ) {
        setAuthentication(null);
      }
      throw error;
    }
  };

  const mutation = useReactQueryMutation(mutationFn, options);

  return mutation;
};

export default useMutation;
