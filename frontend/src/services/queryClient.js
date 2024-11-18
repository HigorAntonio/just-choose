import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Desativa o refetch ao voltar ao foco
      // refetchOnReconnect: false,  // Desativa o refetch ao reconectar
    },
  },
});
