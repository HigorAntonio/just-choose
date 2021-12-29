import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import UserProfileStartLists from '../UserProfileStartLists';
import UserProfileStartPolls from '../UserProfileStartPolls';
import UserProfileStartVotes from '../UserProfileStartVotes';

import { Container } from './styles';

const UserProfileStart = () => {
  const { userId } = useContext(AuthContext);
  const { id: profileId } = useParams();

  return (
    <Container>
      <UserProfileStartLists />
      <UserProfileStartPolls />
      {parseInt(userId) === parseInt(profileId) && <UserProfileStartVotes />}
    </Container>
  );
};

export default UserProfileStart;
