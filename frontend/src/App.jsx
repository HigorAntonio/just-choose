import Layout from './components/Layout';

import { AuthContextProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ViewportContextProvider } from './context/ViewportContext';
import { AlertContextProvider } from './context/AlertContext';

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <ViewportContextProvider>
          <AlertContextProvider>
            <Layout />
          </AlertContextProvider>
        </ViewportContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
