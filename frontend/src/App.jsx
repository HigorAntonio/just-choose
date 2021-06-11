import Layout from './components/Layout';
import GlobalStyles from './styles/GlobalStyles';

import { AuthContextProvider } from './context/AuthContext';
import { AlertContextProvider } from './context/AlertContext';

function App() {
  return (
    <AuthContextProvider>
      <AlertContextProvider>
        <Layout />
        <GlobalStyles />
      </AlertContextProvider>
    </AuthContextProvider>
  );
}

export default App;
