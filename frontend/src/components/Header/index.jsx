import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { ClickAwayListener } from '@material-ui/core';
import { ThemeContext } from 'styled-components';
import { BiCog, BiLogOut } from 'react-icons/bi';
import { HiOutlineMoon } from 'react-icons/hi';
import { HiDocumentAdd } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';
import queryString from 'query-string';

import TooltipHover from '../TooltipHover';
import Modal from '../Modal';
import Sign from '../SignModal';
import Switch from '../Switch';

import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
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
  SignIn,
  SignUp,
  ProfileWrapper,
  Profile,
  ProfileDropDown,
  ProfileOption,
  ProfileImage,
  ProfileData,
  DropDownSeparator,
  DropDownOption,
} from './styles';

function Header() {
  const history = useHistory();
  const location = useLocation();
  const { query } = queryString.parse(location.search);

  const { title: theme, colors } = useContext(ThemeContext);
  const { theme: appTheme, toggleTheme } = useContext(AppThemeContext);
  const { loading, authenticated, handleLogout } = useContext(AuthContext);
  const { userProfile, setUserProfile } = useContext(ProfileContext);

  const [showSignModal, setShowSignModal] = useState(false);
  const [navOption, setNavOption] = useState('');
  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const [showSearchDropDown, setShowSearchDropDown] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (location.pathname === '/search' && query) {
      setSearch(query);
    }
  }, [query, location]);

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
      history.push('/');
      await handleLogout();
      setUserProfile({});
      setShowProfileDropDown(false);
    } catch (error) {}
  };

  const handleUserExitOnKeyPress = async (e) => {
    if (e.key === 'Enter') {
      try {
        await handleUserExit();
      } catch (error) {}
    }
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    history.push(`/search?query=${search}`);
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      handleSearch();
    }
  };

  const handleProfileDropdownKeyDown = (e) => {
    if (e.key === 'Escape') {
      document.activeElement
        .closest('[data-profile-wrapper]')
        .querySelector('[data-profile-image]')
        .focus();
      setShowProfileDropDown(false);
    }
  };

  const handleProfileImageOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowProfileDropDown((prevState) => !prevState);
    }
  };

  const handleThemeSwitchOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      toggleTheme();
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
            onKeyPress={handleSearchInputKeyPress}
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
                onKeyPress={handleSearchInputKeyPress}
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
            <Link to="/list" tabIndex="-1">
              <TooltipHover
                tooltipText="Nova Lista"
                width="80px"
                transitionDuration="0.4s"
              >
                <NewListButton>
                  {/* <NewListIcon /> */}
                  <HiDocumentAdd size={25} style={{ flexShrink: 0 }} />
                </NewListButton>
              </TooltipHover>
            </Link>
          )}
          {!loading && !authenticated && (
            <>
              <SignIn onClick={handleSignIn}>Entrar</SignIn>
              <SignUp onClick={handleSignUp}>Cadastrar-se</SignUp>
            </>
          )}
          <ProfileWrapper
            onKeyDown={handleProfileDropdownKeyDown}
            data-profile-wrapper
          >
            <ClickAwayListener
              onClickAway={() => setShowProfileDropDown(false)}
            >
              <div>
                <Profile
                  src={userProfile.profile_image_url}
                  onClick={() =>
                    setShowProfileDropDown((prevState) => !prevState)
                  }
                  onKeyPress={handleProfileImageOnKeyPress}
                  tabIndex="0"
                  data-profile-image
                />
                <ProfileDropDown show={showProfileDropDown}>
                  {authenticated && (
                    <>
                      <ProfileOption>
                        <Link
                          to={`/settings`}
                          onClick={() => setShowProfileDropDown(false)}
                          tabIndex="-1"
                        >
                          <ProfileImage src={userProfile.profile_image_url} />
                        </Link>
                        <ProfileData>
                          <span>{userProfile.name}</span>
                        </ProfileData>
                      </ProfileOption>
                      <DropDownSeparator />
                      <Link
                        to={`/settings`}
                        onClick={() => setShowProfileDropDown(false)}
                      >
                        <DropDownOption className="hover">
                          <div className="align-left">
                            <BiCog size={20} style={{ flexShrink: 0 }} />{' '}
                          </div>
                          <div className="align-right">Configurações</div>
                        </DropDownOption>
                      </Link>
                    </>
                  )}
                  <DropDownOption
                    onKeyPress={handleThemeSwitchOnKeyPress}
                    tabIndex="0"
                  >
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
                        tabIndex="-1"
                      />
                    </div>
                  </DropDownOption>
                  {authenticated && (
                    <>
                      <DropDownSeparator />
                      <DropDownOption
                        className="hover"
                        onClick={handleUserExit}
                        onKeyPress={handleUserExitOnKeyPress}
                        tabIndex="0"
                      >
                        <div className="align-left">
                          <BiLogOut size={20} style={{ flexShrink: 0 }} />{' '}
                        </div>
                        <div className="align-right">Sair</div>
                      </DropDownOption>
                    </>
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
