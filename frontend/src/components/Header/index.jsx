import React, { useState } from 'react';

import SignModal from '../SignModal';

import {
  Container,
  Logo,
  SearchWrapper,
  SearchInput,
  SearchButton,
  SearchIcon,
  NavMenu,
  NewListButton,
  NewListIcon,
  NewPollButton,
  NewPollIcon,
  Tooltip,
  SignIn,
  SignUp,
  Profile,
} from './styles';

function Header() {
  const [showSignModal, setShowSignModal] = useState(false);
  const [navOption, setNavOption] = useState('');

  const handleSignIn = () => {
    setShowSignModal(true);
    setNavOption('signIn');
  };

  const handleSignUp = () => {
    setShowSignModal(true);
    setNavOption('signUp');
  };

  return (
    <Container>
      <Logo />

      <SearchWrapper>
        <SearchInput type="search" placeholder="Buscar" />
        <SearchButton disabled>
          <SearchIcon />
        </SearchButton>
      </SearchWrapper>

      <NavMenu>
        <NewListButton>
          <NewListIcon />
          <Tooltip width="80px">Nova Lista</Tooltip>
        </NewListButton>
        <NewPollButton>
          <NewPollIcon />
          <Tooltip width="100px">Nova Votação</Tooltip>
        </NewPollButton>
        <SignIn onClick={handleSignIn}>Entrar</SignIn>
        <SignUp onClick={handleSignUp}>Cadastrar-se</SignUp>
        <Profile />
      </NavMenu>

      <SignModal
        show={showSignModal}
        setShow={setShowSignModal}
        navOption={navOption}
        setNavOption={setNavOption}
      />
    </Container>
  );
}

export default Header;
