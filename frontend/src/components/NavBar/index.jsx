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
import { FollowingProfilesContext } from '../../context/FollowingProfilesContext';
import useAuthenticatedRequest from '../../hooks/useAuthenticatedRequest';
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
  SearchProfile,
  SearchProfileInput,
  NoResults,
} from './styles';

const NavBar = () => {
  const { authenticated } = useContext(AuthContext);
  const { width } = useContext(ViewportContext);
  const { following, lastFollowRef } = useContext(FollowingProfilesContext);

  const [profilesParams, setProfilesParams] = useState({});
  const [profilesPageNumber, setProfilesPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const wrapperRef = useRef();

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTo(0, 0);
  }, [wrapperRef, showSearch]);

  const {
    data: profiles,
    hasMore: profilesHasMore,
    loading: profilesLoading,
  } = useAuthenticatedRequest('/profiles', profilesParams, profilesPageNumber);

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
      setProfilesParams({ query: e.target.value });
      setProfilesPageNumber(1);
    }
  };

  const profilesObserver = useRef();
  const lastProfileRef = useCallback(
    (node) => {
      if (profilesLoading) {
        return;
      }
      if (profilesObserver.current) {
        profilesObserver.current.disconnect();
      }
      profilesObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && profilesHasMore) {
          setProfilesPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        profilesObserver.current.observe(node);
      }
    },
    [profilesLoading, profilesHasMore, setProfilesPageNumber]
  );

  return (
    <Container>
      <TopSide ref={wrapperRef} tabIndex="-1">
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
                    <Link key={p.id} to={`/profiles/${p.id}`}>
                      <Profile ref={lastFollowRef} title={p.name}>
                        <ProfileImage src={p.profile_image_url} />
                        <ProfileData>
                          <span>{p.name}</span>
                        </ProfileData>
                      </Profile>
                    </Link>
                  );
                }
                return (
                  <Link key={p.id} to={`/profiles/${p.id}`}>
                    <Profile title={p.name}>
                      <ProfileImage src={p.profile_image_url} />
                      <ProfileData>
                        <span>{p.name}</span>
                      </ProfileData>
                    </Profile>
                  </Link>
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
              {profiles.map((p, i) => {
                if (profiles.length === i + 1) {
                  return (
                    <Link key={p.id} to={`/profiles/${p.id}`}>
                      <Profile ref={lastProfileRef} title={p.name}>
                        <ProfileImage src={p.profile_image_url} />
                        <ProfileData>
                          <span>{p.name}</span>
                        </ProfileData>
                      </Profile>
                    </Link>
                  );
                }
                return (
                  <Link key={p.id} to={`/profiles/${p.id}`}>
                    <Profile title={p.name}>
                      <ProfileImage src={p.profile_image_url} />
                      <ProfileData>
                        <span>{p.name}</span>
                      </ProfileData>
                    </Profile>
                  </Link>
                );
              })}
            </Profiles>
            {!profilesLoading && !profiles.length && (
              <NoResults>
                Infelizmente, não encontramos ninguém chamado "
                {profilesParams.query}"
              </NoResults>
            )}
          </Following>
        )}
      </TopSide>
      {authenticated && width > breakpoints.getInt(breakpoints.size1) && (
        <BottomSide>
          <SearchProfile>
            <GoSearch size={15} style={{ flexShrink: 0 }} />
            <SearchProfileInput
              type="text"
              placeholder="Adicionar amigos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </SearchProfile>
        </BottomSide>
      )}
    </Container>
  );
};

export default NavBar;
