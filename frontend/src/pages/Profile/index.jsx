import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';
import { FollowingProfilesContext } from '../../context/FollowingProfilesContext';

import justChooseApi from '../../services/justChooseApi';
import NotFound from '../../components/NotFound';
import HorizontalDragScrolling from '../../components/HorizontalDragScrolling';
import Start from './Start';
import Lists from './Lists';
import Polls from './Polls';
import Votes from './Votes';
import Following from './Following';
import navOnAuxClick from '../../utils/navOnAuxClick';

import {
  Container,
  StickyWrapper,
  Header,
  HeaderContainer,
  ProfileWrapper,
  ProfileImage,
  ProfileImageWrapper,
  ProfileMeta,
  ProfileName,
  ProfileFollowers,
  HeaderButtons,
  FollowButton,
  Navigation,
  NavigationWrapper,
  Main,
} from './styles';

const Profile = () => {
  const history = useHistory();
  const { id: profileToShowId } = useParams();
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const { profileId, authenticated } = useContext(AuthContext);
  const {
    profile: { is_active: isProfileActive },
  } = useContext(ProfileContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { setFollowing: setFollowingList } = useContext(
    FollowingProfilesContext
  );
  const { contentWrapperRef } = useContext(LayoutContext);

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileImageError, setProfileImageError] = useState(false);

  const mounted = useRef();
  const source = useRef();

  const clearState = () => {
    setLoadingError(false);
    setFollowing(false);
    setProfile({});
    setProfileImageError(false);
  };

  useEffect(() => {
    if (
      (location.pathname !== `${path.replace(':id', profileToShowId)}` &&
        location.pathname !== `${path.replace(':id', profileToShowId)}/lists` &&
        location.pathname !== `${path.replace(':id', profileToShowId)}/polls` &&
        location.pathname !== `${path.replace(':id', profileToShowId)}/votes` &&
        location.pathname !==
          `${path.replace(':id', profileToShowId)}/following` &&
        location.pathname !==
          `${path.replace(':id', profileToShowId)}/about`) ||
      (location.pathname === `${path.replace(':id', profileToShowId)}/votes` &&
        parseInt(profileId) !== parseInt(profileToShowId))
    ) {
      history.replace(`${path.replace(':id', profileToShowId)}`);
    }
  }, [location, path, profileToShowId, profileId, history]);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef, location]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => {
      try {
        setLoading(true);
        clearState();
        const { data } = await justChooseApi.get(
          `/profiles/${profileToShowId}`,
          {
            cancelToken: source.current.token,
          }
        );
        setProfile(data);
        if (authenticated && isProfileActive) {
          const {
            data: { following },
          } = await justChooseApi.get(
            `/profiles/following/${profileToShowId}`,
            {
              cancelToken: source.current.token,
            }
          );
          setFollowing(following);
        }
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        setLoading(false);
        setLoadingError(true);
      }
    })();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, [profileToShowId, authenticated, isProfileActive]);

  const handleFollow = async () => {
    if (!authenticated || !isProfileActive) {
      clearTimeout(alertTimeout);
      setMessage(
        authenticated
          ? 'Confirme seu e-mail para seguir esse perfil'
          : 'Faça login para seguir esse perfil'
      );
      setSeverity('info');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    try {
      if (!following) {
        await justChooseApi.post(`/profiles/follow`, {
          followsId: profileToShowId,
        });
        if (mounted.current) {
          setProfile((prevState) => ({
            ...prevState,
            followers_count: prevState.followers_count + 1,
          }));
          setFollowingList((prevState) => [
            ...prevState,
            {
              id: profile.id,
              name: profile.name,
              profile_image_url: profile.profile_image_url,
            },
          ]);
        }
      }
      if (following) {
        await justChooseApi.delete(`/profiles/follow`, {
          data: { followsId: profileToShowId },
        });
        if (mounted.current) {
          setProfile((prevState) => ({
            ...prevState,
            followers_count: prevState.followers_count - 1,
          }));
          setFollowingList((prevState) =>
            prevState.filter((fl) => fl.id !== profile.id)
          );
        }
      }
      if (mounted.current) {
        setFollowing((prevState) => !prevState);
      }
    } catch (error) {}
  };

  const handlePush = (path) => {
    history.push(path);
  };

  if (loading) {
    return <></>;
  }
  if (loadingError) {
    return <NotFound />;
  }
  return (
    <Container>
      <StickyWrapper>
        <Header>
          <HeaderContainer>
            <ProfileWrapper>
              <ProfileImageWrapper>
                <ProfileImage
                  src={
                    profile.profile_image_url ? profile.profile_image_url : ''
                  }
                  onError={() => setProfileImageError(true)}
                  error={profileImageError}
                />
              </ProfileImageWrapper>
              <ProfileMeta>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileFollowers>{`${profile.followers_count} ${
                  profile.followers_count === 1 ? 'seguidor' : 'seguidores'
                }`}</ProfileFollowers>
              </ProfileMeta>
            </ProfileWrapper>
            {parseInt(profileId) !== parseInt(profileToShowId) && (
              <HeaderButtons>
                {parseInt(profileId) !== parseInt(profileToShowId) &&
                  (!following ? (
                    <FollowButton following={following} onClick={handleFollow}>
                      <FaRegHeart size={'1.6rem'} style={{ flexShrink: 0 }} />
                      <span>Seguir</span>
                    </FollowButton>
                  ) : (
                    <FollowButton following={following} onClick={handleFollow}>
                      <FaHeart size={'1.6rem'} style={{ flexShrink: 0 }} />
                      <span>Seguindo</span>
                    </FollowButton>
                  ))}
              </HeaderButtons>
            )}
          </HeaderContainer>
          <NavigationWrapper>
            <HorizontalDragScrolling>
              <Navigation>
                <div
                  className={location.pathname === `${url}` ? 'active' : ''}
                  onClick={() => handlePush(url)}
                  onAuxClick={(e) => navOnAuxClick(e, url)}
                >
                  Início
                </div>
                <div
                  className={
                    location.pathname === `${url}/lists` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/lists`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/lists`)}
                >
                  Listas
                </div>
                <div
                  className={
                    location.pathname === `${url}/polls` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/polls`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/polls`)}
                >
                  Votações
                </div>
                {parseInt(profileId) === parseInt(profileToShowId) && (
                  <div
                    className={
                      location.pathname === `${url}/votes` ? 'active' : ''
                    }
                    onClick={() => handlePush(`${url}/votes`)}
                    onAuxClick={(e) => navOnAuxClick(e, `${url}/votes`)}
                  >
                    Votos
                  </div>
                )}
                <div
                  className={
                    location.pathname === `${url}/following` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/following`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/following`)}
                >
                  Seguindo
                </div>
                <div
                  className={
                    location.pathname === `${url}/about` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/about`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/about`)}
                >
                  Sobre
                </div>
              </Navigation>
            </HorizontalDragScrolling>
          </NavigationWrapper>
        </Header>
      </StickyWrapper>
      <Main>
        {location.pathname === `${path.replace(':id', profileToShowId)}` && (
          <Start />
        )}
        {location.pathname ===
          `${path.replace(':id', profileToShowId)}/lists` && <Lists />}
        {location.pathname ===
          `${path.replace(':id', profileToShowId)}/polls` && <Polls />}
        {location.pathname ===
          `${path.replace(':id', profileToShowId)}/votes` &&
          parseInt(profileId) === parseInt(profileToShowId) && <Votes />}
        {location.pathname ===
          `${path.replace(':id', profileToShowId)}/following` && <Following />}
      </Main>
    </Container>
  );
};

export default Profile;
