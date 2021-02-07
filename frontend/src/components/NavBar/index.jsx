import React from 'react';

import {
  Container,
  TopSide,
  Header,
  Profiles,
  Profile,
  ProfileImage,
  ProfileData,
  BottomSide,
  SearchUser,
  SearchUserInput,
} from './styles';

const NavBar = () => {
  return (
    <Container>
      <TopSide>
        <Header>
          <h5>Seguindo</h5>
        </Header>
        <Profiles>
          <Profile>
            <ProfileImage></ProfileImage>
            <ProfileData>
              <span>Username</span>
            </ProfileData>
          </Profile>
          <Profile>
            <ProfileImage></ProfileImage>
            <ProfileData>
              <span>Username</span>
            </ProfileData>
          </Profile>
          <Profile>
            <ProfileImage></ProfileImage>
            <ProfileData>
              <span>Username</span>
            </ProfileData>
          </Profile>
        </Profiles>
      </TopSide>
      <BottomSide>
        <SearchUser>
          <SearchUserInput type="text" placeholder="Adicionar amigos" />
        </SearchUser>
      </BottomSide>
    </Container>
  );
};

export default NavBar;
