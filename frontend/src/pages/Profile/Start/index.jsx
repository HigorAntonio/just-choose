import React, { useContext } from 'react';

import { AuthContext } from '../../../context/AuthContext';

import StartLists from '../StartLists';
import StartPolls from '../StartPolls';
import StartVotes from '../StartVotes';

import { Container } from './styles';

const Start = ({ profileToShowId }) => {
  const { authentication } = useContext(AuthContext);

  return (
    <Container>
      <StartLists profileToShowId={profileToShowId} />
      <StartPolls profileToShowId={profileToShowId} />
      {parseInt(authentication?.profile?.id) === parseInt(profileToShowId) && (
        <StartVotes profileToShowId={profileToShowId} />
      )}
    </Container>
  );
};

export default Start;
