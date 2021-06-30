import { ThemeProvider } from 'styled-components';

import light from './styles/themes/light';
import Layout from './components/Layout';
import GlobalStyles from './styles/GlobalStyles';

import { AuthContextProvider } from './context/AuthContext';
import { AlertContextProvider } from './context/AlertContext';

function App() {
  return (
    <ThemeProvider theme={light}>
      <AuthContextProvider>
        <AlertContextProvider>
          <Layout />
          <GlobalStyles />
        </AlertContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
