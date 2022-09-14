import React, { useContext } from 'react';

import { AuthContext } from '../../../context/AuthContext';

import StartLists from '../StartLists';
import StartPolls from '../StartPolls';
import StartVotes from '../StartVotes';

import { Container } from './styles';

const Start = ({ profileToShowId }) => {
  const { profileId } = useContext(AuthContext);

  return (
    <Container>
      <StartLists profileToShowId={profileToShowId} />
      <StartPolls profileToShowId={profileToShowId} />
      {parseInt(profileId) === parseInt(profileToShowId) && (
        <StartVotes profileToShowId={profileToShowId} />
      )}
    </Container>
  );
};

export default Start;
