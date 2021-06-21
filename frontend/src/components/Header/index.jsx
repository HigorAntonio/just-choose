import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { BiLogOut } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import Modal from '../Modal';
import Sign from '../SignModal';

import { AuthContext } from '../../context/AuthContext';

import {
  Container,
  LogoWrapper,
  SearchWrapper,
  NavMenuWrapper,
  Logo,
  SearchBar,
  SearchInput,
  SearchButton,
  SearchIcon,
  NavMenu,
  NewListButton,
  NewListIcon,
  Tooltip,
  SignIn,
  SignUp,
  ProfileWrapper,
  Profile,
  ProfileDropDown,
  DropDownOption,
} from './styles';

function Header() {
  const history = useHistory();
  const { authenticated, handleLogout } = useContext(AuthContext);
  const [showSignModal, setShowSignModal] = useState(false);
  const [navOption, setNavOption] = useState('');
  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const [search, setSearch] = useState('');

  const handleSignIn = () => {
    setShowSignModal(true);
    setNavOption('signIn');
  };

  const handleSignUp = () => {
    setShowSignModal(true);
    setNavOption('signUp');
  };

  const handleUserExit = async () => {
    try {
      await handleLogout();
    } catch (error) {}
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    history.push(`/search?query=${search}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      handleSearch();
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <Link to="/">
          <Logo />
        </Link>
      </LogoWrapper>

      <SearchWrapper>
        <SearchBar>
          <SearchInput
            type="search"
            placeholder="Buscar"
            value={search}
            onChange={searchChange}
            onKeyPress={handleKeyPress}
          />
          <SearchButton disabled={!search} onClick={handleSearch}>
            <SearchIcon />
          </SearchButton>
        </SearchBar>
      </SearchWrapper>

      <NavMenuWrapper>
        <NavMenu>
          {authenticated && (
            <Link to="/list">
              <NewListButton>
                <NewListIcon />
                <Tooltip width="80px">Nova Lista</Tooltip>
              </NewListButton>
            </Link>
          )}
          {!authenticated && (
            <>
              <SignIn onClick={handleSignIn}>Entrar</SignIn>
              <SignUp onClick={handleSignUp}>Cadastrar-se</SignUp>
            </>
          )}
          <ProfileWrapper>
            <ClickAwayListener
              onClickAway={() => setShowProfileDropDown(false)}
            >
              <Profile
                onClick={() =>
                  setShowProfileDropDown((prevState) => !prevState)
                }
              />
            </ClickAwayListener>
            <ProfileDropDown show={showProfileDropDown}>
              {authenticated && (
                <DropDownOption onClick={handleUserExit}>
                  <div className="align-left">
                    <BiLogOut
                      size={20}
                      color="#fff"
                      style={{ flexShrink: 0 }}
                    />{' '}
                  </div>
                  <div className="align-right">Sair</div>
                </DropDownOption>
              )}
            </ProfileDropDown>
          </ProfileWrapper>
        </NavMenu>
      </NavMenuWrapper>

      <Modal show={showSignModal} setShow={setShowSignModal}>
        <Sign
          setShow={setShowSignModal}
          navOption={navOption}
          setNavOption={setNavOption}
        />
      </Modal>
    </Container>
  );
}

export default Header;
