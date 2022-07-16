import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';

import StartLists from '../StartLists';
import StartPolls from '../StartPolls';
import StartVotes from '../StartVotes';

import { Container } from './styles';

const Start = () => {
  const { profileId } = useContext(AuthContext);
  const { id: profileToShowId } = useParams();

  return (
    <Container>
      <StartLists />
      <StartPolls />
      {parseInt(profileId) === parseInt(profileToShowId) && <StartVotes />}
    </Container>
  );
};

export default Start;
