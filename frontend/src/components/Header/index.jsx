import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ClickAwayListener } from '@material-ui/core';
import { ThemeContext } from 'styled-components';
import { BiLogOut } from 'react-icons/bi';
import { HiOutlineMoon } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { HiDocumentAdd } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';

import Modal from '../Modal';
import Sign from '../SignModal';
import Switch from '../Switch';

import { AuthContext } from '../../context/AuthContext';
import { ThemeContext as AppThemeContext } from '../../context/ThemeContext';

import {
  Container,
  LogoWrapper,
  SearchWrapper,
  NavMenuWrapper,
  Logo,
  SearchBar,
  SearchInput,
  SearchButton,
  NavMenu,
  NewListButton,
  // NewListIcon,
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

  const { title: theme, colors } = useContext(ThemeContext);
  const { theme: appTheme, toggleTheme } = useContext(AppThemeContext);

  const { loading, authenticated, handleLogout } = useContext(AuthContext);
  const [showSignModal, setShowSignModal] = useState(false);
  const [navOption, setNavOption] = useState('');
  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const [showSearchDropDown, setShowSearchDropDown] = useState(false);
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
      setShowProfileDropDown(false);
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
          <Logo theme={theme} />
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
            <FiSearch size={25} style={{ flexShrink: 0 }} />
          </SearchButton>
        </SearchBar>
        <ClickAwayListener
          onClickAway={() => {
            setShowSearchDropDown(false);
          }}
        >
          <div>
            <SearchButton
              className="squared no-background search-button-small-screen"
              onClick={() => setShowSearchDropDown((prevState) => !prevState)}
            >
              <FiSearch size={25} style={{ flexShrink: 0 }} />
            </SearchButton>
            <SearchBar
              className="searchbar-small-screen"
              show={showSearchDropDown}
            >
              <SearchInput
                type="search"
                placeholder="Buscar"
                value={search}
                onChange={searchChange}
                onKeyPress={handleKeyPress}
              />
              <SearchButton disabled={!search} onClick={handleSearch}>
                <FiSearch size={25} style={{ flexShrink: 0 }} />
              </SearchButton>
            </SearchBar>
          </div>
        </ClickAwayListener>
      </SearchWrapper>

      <NavMenuWrapper>
        <NavMenu>
          {!loading && authenticated && (
            <Link to="/list">
              <NewListButton>
                {/* <NewListIcon /> */}
                <HiDocumentAdd size={25} style={{ flexShrink: 0 }} />
                <Tooltip width="80px">Nova Lista</Tooltip>
              </NewListButton>
            </Link>
          )}
          {!loading && !authenticated && (
            <>
              <SignIn onClick={handleSignIn}>Entrar</SignIn>
              <SignUp onClick={handleSignUp}>Cadastrar-se</SignUp>
            </>
          )}
          <ProfileWrapper>
            <ClickAwayListener
              onClickAway={() => setShowProfileDropDown(false)}
            >
              <div>
                <Profile
                  onClick={() =>
                    setShowProfileDropDown((prevState) => !prevState)
                  }
                />
                <ProfileDropDown show={showProfileDropDown}>
                  <DropDownOption>
                    <div className="align-left">
                      <HiOutlineMoon size={20} style={{ flexShrink: 0 }} />{' '}
                    </div>
                    <div className="align-right switch">
                      <label htmlFor="theme-switch">Tema escuro</label>
                      <Switch
                        id="theme-switch"
                        checked={appTheme.title === 'dark'}
                        onChange={toggleTheme}
                        uncheckedIcon={false}
                        border={`2px solid ${colors['primary-400']}`}
                        offborder={`2px solid ${colors.text}`}
                        borderwidth={2}
                        width={35}
                        height={20}
                        handleDiameter={12}
                        onColor={colors['background-100']}
                        offColor={colors['background-100']}
                        onHandleColor={colors['primary-400']}
                        offHandleColor={colors.text}
                        checkedcolor={colors['primary-400']}
                      />
                    </div>
                  </DropDownOption>
                  {authenticated && (
                    <DropDownOption className="hover" onClick={handleUserExit}>
                      <div className="align-left">
                        <BiLogOut size={20} style={{ flexShrink: 0 }} />{' '}
                      </div>
                      <div className="align-right">Sair</div>
                    </DropDownOption>
                  )}
                </ProfileDropDown>
              </div>
            </ClickAwayListener>
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
