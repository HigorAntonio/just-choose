import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './routes/Home';
import CreateMovieList from './routes/CreateMovieList';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/movies/list" component={CreateMovieList} />
        </Switch>
      </Router>
      <GlobalStyles />
    </>
  );
}

export default App;
