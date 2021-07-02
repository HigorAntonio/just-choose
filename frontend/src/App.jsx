import Layout from './components/Layout';

import { AuthContextProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { AlertContextProvider } from './context/AlertContext';

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <AlertContextProvider>
          <Layout />
        </AlertContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
