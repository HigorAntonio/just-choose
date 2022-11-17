import Layout from './components/Layout';
import { QueryClientProvider } from 'react-query';

import { queryClient } from './services/queryClient';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ViewportContextProvider } from './context/ViewportContext';
import { AlertContextProvider } from './context/AlertContext';
import { FollowingProfilesContextProvider } from './context/FollowingProfilesContext';
import { LayoutContextProvider } from './context/LayoutContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <ViewportContextProvider>
            <AlertContextProvider>
              <FollowingProfilesContextProvider>
                <LayoutContextProvider>
                  <Layout />
                </LayoutContextProvider>
              </FollowingProfilesContextProvider>
            </AlertContextProvider>
          </ViewportContextProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
