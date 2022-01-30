import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import CustomRoute from '../CustomRoute';

import Home from '../../routes/Home';
import CreateList from '../../routes/CreateList';
import ShowList from '../../routes/ShowList';
import UpdateList from '../../routes/UpdateList';
import CreatePoll from '../../routes/CreatePoll';
import ShowPoll from '../../routes/ShowPoll';
import Search from '../../routes/Search';
import UpdatePoll from '../../routes/UpdatePoll';
import Settings from '../../routes/Settings';
import UserProfile from '../../routes/UserProfile';
import NotFound from '../../components/NotFound';

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
