import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import CustomRoute from './components/CustomRoute';

import Home from './pages/Home';
import CreateList from './pages/CreateList';
import ShowList from './pages/ShowList';
import UpdateList from './pages/UpdateList';
import CreatePoll from './pages/CreatePoll';
import ShowPoll from './pages/ShowPoll';
import Search from './pages/Search';
import UpdatePoll from './pages/UpdatePoll';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import NotFound from './components/NotFound';

const Routes = () => {
  return (
    <Switch>
      <CustomRoute exact path="/" component={() => <Home />} />
      <CustomRoute exact path="/search" component={() => <Search />} />
      <CustomRoute
        isPrivate
        requiresUserActivation
        exact
        path="/list"
        component={() => <CreateList />}
      />
      <CustomRoute exact path="/lists/:id" component={() => <ShowList />} />
      <CustomRoute
        isPrivate
        requiresUserActivation
        exact
        path="/lists/:id/update"
        component={() => <UpdateList />}
      />
      <CustomRoute
        isPrivate
        requiresUserActivation
        exact
        path="/lists/:id/poll"
        component={() => <CreatePoll />}
      />
      <CustomRoute exact path="/polls/:id" component={() => <ShowPoll />} />
      <CustomRoute
        isPrivate
        requiresUserActivation
        exact
        path="/polls/:id/update"
        component={() => <UpdatePoll />}
      />
      <CustomRoute isPrivate path="/settings" component={() => <Settings />} />
      <CustomRoute path="/users/:id" component={() => <UserProfile />} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default memo(Routes);
