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
import useInfiniteQuery from '../../hooks/useInfiniteQuery';
import justChooseApi from '../../services/justChooseApi';
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
  const { authentication } = useContext(AuthContext);
  const { width } = useContext(ViewportContext);
  const {
    isFetching: isFetchingFollowingProfiles,
    isFetchingNextPage: isFetchingNextFollowingProfilesPage,
    followingProfilesData,
    lastElementRef: lastFollowingProfileRef,
  } = useContext(FollowingProfilesContext);

  const [params, setParams] = useState({});
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const wrapperRef = useRef();

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTo(0, 0);
  }, [wrapperRef, showSearch]);

  const searchProfiles = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/profiles', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const {
    isFetching: isFetchingSearchProfiles,
    isFetchingNextPage: isFetchingNextSearchProfilesPage,
    data: searchProfilesData,
    lastElementRef: lastSearchProfileRef,
  } = useInfiniteQuery(['navBar/searchProfiles', params], searchProfiles, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.page < lastPage.total_pages
        ? pages.length + 1
        : undefined;
    },
  });

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
      setParams({ query: e.target.value });
    }
  };

  return (
    <Container>
      <TopSide ref={wrapperRef} tabIndex="-1">
        <Navigation>
          <Link to="/">
            <NavOption title="Início">
              <AiFillHome size={'30px'} style={{ flexShrink: 0 }} />
              <div>
                <span>Início</span>
              </div>
            </NavOption>
          </Link>
          <NavOption title="Populares">
            <AiFillFire size={'30px'} style={{ flexShrink: 0 }} />
            <div>
              <span>Populares</span>
            </div>
          </NavOption>
          <NavOption title="Seguindo">
            <BsFillPeopleFill size={'30px'} style={{ flexShrink: 0 }} />
            <div>
              <span>Seguindo</span>
            </div>
          </NavOption>
        </Navigation>
        {authentication && !showSearch && (
          <Following>
            <Header>
              <h5>Seguindo</h5>
            </Header>
            <Profiles>
              {followingProfilesData?.map((p, i) => {
                if (followingProfilesData.length === i + 1) {
                  return (
                    <Link key={p.id} to={`/profiles/${p.name}`}>
                      <Profile
                        ref={lastFollowingProfileRef}
                        title={p.display_name}
                      >
                        <ProfileImage src={p.profile_image_url} />
                        <ProfileData>
                          <span>{p.display_name}</span>
                        </ProfileData>
                      </Profile>
                    </Link>
                  );
                }
                return (
                  <Link key={p.id} to={`/profiles/${p.name}`}>
                    <Profile title={p.display_name}>
                      <ProfileImage src={p.profile_image_url} />
                      <ProfileData>
                        <span>{p.display_name}</span>
                      </ProfileData>
                    </Profile>
                  </Link>
                );
              })}
            </Profiles>
          </Following>
        )}
        {authentication && showSearch && (
          <Following>
            <Header>
              <h5>Resultados</h5>
            </Header>
            <Profiles>
              {searchProfilesData?.pages.map((page) => {
                return page.results.map((p, i) => {
                  if (page.results.length === i + 1) {
                    return (
                      <Link key={p.id} to={`/profiles/${p.name}`}>
                        <Profile
                          ref={lastSearchProfileRef}
                          title={p.display_name}
                        >
                          <ProfileImage src={p.profile_image_url} />
                          <ProfileData>
                            <span>{p.display_name}</span>
                          </ProfileData>
                        </Profile>
                      </Link>
                    );
                  }
                  return (
                    <Link key={p.id} to={`/profiles/${p.name}`}>
                      <Profile title={p.display_name}>
                        <ProfileImage src={p.profile_image_url} />
                        <ProfileData>
                          <span>{p.display_name}</span>
                        </ProfileData>
                      </Profile>
                    </Link>
                  );
                });
              })}
            </Profiles>
            {!isFetchingSearchProfiles &&
              searchProfilesData?.pages[0]?.total_results === 0 && (
                <NoResults>
                  Infelizmente, não encontramos ninguém chamado "{params.query}"
                </NoResults>
              )}
          </Following>
        )}
      </TopSide>
      {authentication && width > breakpoints.getInt(breakpoints.size1) && (
        <BottomSide>
          <SearchProfile>
            <GoSearch size={'15px'} style={{ flexShrink: 0 }} />
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
