import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { AiFillHome } from 'react-icons/ai';
import { AiFillFire } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { GoSearch } from 'react-icons/go';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { ViewportContext } from '../../context/ViewportContext';
import useUserRequest from '../../hooks/useUserRequest';
import breakpoints from '../../styles/breakpoints';

import {
  Container,
  TopSide,
  Following,
  Navigation,
  NavOption,
  Header,
  Profiles,
  Profile,
  ProfileImage,
  ProfileData,
  BottomSide,
  SearchUser,
  SearchUserInput,
  NoResults,
} from './styles';

const NavBar = () => {
  const [followsParams] = useState({});
  const [followsPageNumber, setFollowsPageNumber] = useState(1);
  const [usersParams, setUsersParams] = useState({});
  const [usersPageNumber, setUsersPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { authenticated } = useContext(AuthContext);
  const { width } = useContext(ViewportContext);

  const wrapperRef = useRef();

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef, showSearch]);

  const {
    data: following,
    hasMore: followsHasMore,
    loading: followsLoading,
  } = useUserRequest('/profile/follows', followsParams, followsPageNumber);

  const {
    data: users,
    hasMore: usersHasMore,
    loading: usersLoading,
  } = useUserRequest('/users', usersParams, usersPageNumber);

  // useEffect(() => console.debug('following:', following), [following]);

  useEffect(() => {
    if (search === '') {
      setShowSearch(false);
    }
  }, [search]);

  useEffect(() => {
    if (width <= breakpoints.getInt(breakpoints.size1)) {
      setShowSearch(false);
    }
  }, [width]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setShowSearch(true);
      setUsersParams({ query: e.target.value });
      setUsersPageNumber(1);
    }
  };

  const followsObserver = useRef();
  const lastFollowRef = useCallback(
    (node) => {
      if (followsLoading) {
        return;
      }
      if (followsObserver.current) {
        followsObserver.current.disconnect();
      }
      followsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && followsHasMore) {
          setFollowsPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        followsObserver.current.observe(node);
      }
    },
    [followsLoading, followsHasMore, setFollowsPageNumber]
  );

  const usersObserver = useRef();
  const lastUserRef = useCallback(
    (node) => {
      if (usersLoading) {
        return;
      }
      if (usersObserver.current) {
        usersObserver.current.disconnect();
      }
      usersObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && usersHasMore) {
          setUsersPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        usersObserver.current.observe(node);
      }
    },
    [usersLoading, usersHasMore, setUsersPageNumber]
  );

  return (
    <Container>
      <TopSide ref={wrapperRef}>
        <Navigation>
          <Link to="/">
            <NavOption title="Início">
              <AiFillHome size={30} style={{ flexShrink: 0 }} />
              <div>
                <span>Início</span>
              </div>
            </NavOption>
          </Link>
          <NavOption title="Populares">
            <AiFillFire size={30} style={{ flexShrink: 0 }} />
            <div>
              <span>Populares</span>
            </div>
          </NavOption>
          <NavOption title="Seguindo">
            <BsFillPeopleFill size={30} style={{ flexShrink: 0 }} />
            <div>
              <span>Seguindo</span>
            </div>
          </NavOption>
        </Navigation>
        {authenticated && !showSearch && (
          <Following>
            <Header>
              <h5>Seguindo</h5>
            </Header>
            <Profiles>
              {following.map((p, i) => {
                if (following.length === i + 1) {
                  return (
                    <Profile
                      ref={lastFollowRef}
                      key={p.user_id}
                      title={p.user_name}
                    >
                      <ProfileImage src={p.profile_image_url} />
                      <ProfileData>
                        <span>{p.user_name}</span>
                      </ProfileData>
                    </Profile>
                  );
                }
                return (
                  <Profile key={p.user_id} title={p.user_name}>
                    <ProfileImage src={p.profile_image_url} />
                    <ProfileData>
                      <span>{p.user_name}</span>
                    </ProfileData>
                  </Profile>
                );
              })}
            </Profiles>
          </Following>
        )}
        {authenticated && showSearch && (
          <Following>
            <Header>
              <h5>Resultados</h5>
            </Header>
            <Profiles>
              {users.map((p, i) => {
                if (users.length === i + 1) {
                  return (
                    <Profile ref={lastUserRef} key={p.id} title={p.name}>
                      <ProfileImage src={p.profile_image_url} />
                      <ProfileData>
                        <span>{p.name}</span>
                      </ProfileData>
                    </Profile>
                  );
                }
                return (
                  <Profile key={p.id} title={p.name}>
                    <ProfileImage src={p.profile_image_url} />
                    <ProfileData>
                      <span>{p.name}</span>
                    </ProfileData>
                  </Profile>
                );
              })}
            </Profiles>
            {!usersLoading && !users.length && (
              <NoResults>
                Infelizmente, não encontramos ninguém chamado "
                {usersParams.query}"
              </NoResults>
            )}
          </Following>
        )}
      </TopSide>
      {authenticated && width >= breakpoints.getInt(breakpoints.size1) && (
        <BottomSide>
          <SearchUser>
            <GoSearch size={15} style={{ flexShrink: 0 }} />
            <SearchUserInput
              type="text"
              placeholder="Adicionar amigos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </SearchUser>
        </BottomSide>
      )}
    </Container>
  );
};

export default NavBar;
