import React from 'react';

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
  Profile,
} from './styles';

function Header() {
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
        <Profile />
      </NavMenu>
    </Container>
  );
}

export default Header;
