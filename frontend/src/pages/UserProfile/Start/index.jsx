import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';

import StartLists from '../StartLists';
import StartPolls from '../StartPolls';
import StartVotes from '../StartVotes';

import { Container } from './styles';

const Start = () => {
  const { userId } = useContext(AuthContext);
  const { id: profileId } = useParams();

  return (
    <Container>
      <StartLists />
      <StartPolls />
      {parseInt(userId) === parseInt(profileId) && <StartVotes />}
    </Container>
  );
};

export default Start;
