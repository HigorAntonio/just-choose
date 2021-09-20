import Layout from './components/Layout';

import { AuthContextProvider } from './context/AuthContext';
import { ProfileContextProvider } from './context/ProfileContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ViewportContextProvider } from './context/ViewportContext';
import { AlertContextProvider } from './context/AlertContext';

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <ProfileContextProvider>
          <ViewportContextProvider>
            <AlertContextProvider>
              <Layout />
            </AlertContextProvider>
          </ViewportContextProvider>
        </ProfileContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
