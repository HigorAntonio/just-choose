import Layout from './components/Layout';
import GlobalStyles from './styles/GlobalStyles';

import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Layout />
      <GlobalStyles />
    </AuthContextProvider>
  );
}

export default App;
