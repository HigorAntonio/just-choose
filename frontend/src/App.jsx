import Layout from './components/Layout';

import { AuthContextProvider } from './context/AuthContext';
import { ProfileContextProvider } from './context/ProfileContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ViewportContextProvider } from './context/ViewportContext';
import { AlertContextProvider } from './context/AlertContext';
import { FollowingProfilesContextProvider } from './context/FollowingProfilesContext';
import { LayoutContextProvider } from './context/LayoutContext';

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <ProfileContextProvider>
          <ViewportContextProvider>
            <AlertContextProvider>
              <FollowingProfilesContextProvider>
                <LayoutContextProvider>
                  <Layout />
                </LayoutContextProvider>
              </FollowingProfilesContextProvider>
            </AlertContextProvider>
          </ViewportContextProvider>
        </ProfileContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
