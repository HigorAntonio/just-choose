import React from 'react';

import { HeaderButton } from '../styles';
import { BiGitRepoForked } from 'react-icons/bi';

const HeaderButtonFork = () => {
  // const handleFork = async ({}) => {
  //   if (!authentication || authentication?.profile?.is_active === false) {
  //     return;
  //   }
  //   createForkMutation.mutate({ listId });
  // };

  // return (
  //   <HeaderButton
  //     title={
  //       authentication
  //         ? authentication?.profile?.is_active
  //           ? 'Criar uma cópia da lista para sua conta'
  //           : 'Confirme seu e-mail para criar uma cópia da lista'
  //         : 'Faça login para criar uma cópia da lista'
  //     }
  //     onClick={handleFork}
  //   >
  //     {' '}
  //     <BiGitRepoForked size={'25px'} style={{ flexShrink: 0 }} />
  //     <span>{formatCount(data?.forks)}</span>
  //   </HeaderButton>
  // );
  return <></>;
};

export default HeaderButtonFork;
