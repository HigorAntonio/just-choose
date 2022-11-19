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
import About from './About';
import navOnAuxClick from '../../utils/navOnAuxClick';
import Modal from '../../components/Modal';
import ConfirmUnfollowDialog from './ConfirmUnfollowDialog';

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
  const { name: profileToShowName } = useParams();
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const { authentication } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { refetchFollowingProfilesData } = useContext(FollowingProfilesContext);
  const { contentWrapperRef } = useContext(LayoutContext);

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileImageError, setProfileImageError] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  const mounted = useRef();
  const source = useRef();

  const clearState = () => {
    setLoadingError(false);
    setFollowing(false);
    setProfile({});
    setProfileImageError(false);
    setShowUnfollowDialog(false);
  };

  useEffect(() => {
    if (
      (location.pathname !== `${path.replace(':name', profileToShowName)}` &&
        location.pathname !==
          `${path.replace(':name', profileToShowName)}/lists` &&
        location.pathname !==
          `${path.replace(':name', profileToShowName)}/polls` &&
        location.pathname !==
          `${path.replace(':name', profileToShowName)}/votes` &&
        location.pathname !==
          `${path.replace(':name', profileToShowName)}/following` &&
        location.pathname !==
          `${path.replace(':name', profileToShowName)}/about`) ||
      (location.pathname ===
        `${path.replace(':name', profileToShowName)}/votes` &&
        authentication &&
        authentication.profile.name !== profileToShowName)
    ) {
      history.replace(`${path.replace(':name', profileToShowName)}`);
    }
  }, [location, path, profileToShowName, authentication, history]);

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
          `/profiles/${profileToShowName}`,
          {
            cancelToken: source.current.token,
          }
        );
        setProfile(data);
        const { id: profileToShowId } = data;
        if (
          authentication &&
          authentication.profile &&
          authentication.profile.is_active
        ) {
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
  }, [profileToShowName, authentication]);

  const handleUnfollow = async () => {
    setShowUnfollowDialog(false);
    await justChooseApi.delete(`/profiles/follow`, {
      data: { followsId: profile.id },
    });
    if (mounted.current) {
      setProfile((prevState) => ({
        ...prevState,
        followers_count: prevState.followers_count - 1,
      }));
      refetchFollowingProfilesData();
      setFollowing(false);
    }
  };

  const handleFollow = async () => {
    if (
      !authentication ||
      (authentication &&
        authentication.profile &&
        authentication.profile.is_active === false)
    ) {
      clearTimeout(alertTimeout);
      setMessage(
        authentication
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
          followsId: profile.id,
        });
        if (mounted.current) {
          setProfile((prevState) => ({
            ...prevState,
            followers_count: prevState.followers_count + 1,
          }));
          refetchFollowingProfilesData();
          setFollowing(true);
        }
      }
      if (following) {
        if (mounted.current) {
          setShowUnfollowDialog(true);
        }
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
                <ProfileName>{profile.display_name}</ProfileName>
                <ProfileFollowers>{`${profile.followers_count} ${
                  profile.followers_count === 1 ? 'seguidor' : 'seguidores'
                }`}</ProfileFollowers>
              </ProfileMeta>
            </ProfileWrapper>
            {authentication &&
              authentication.profile.name !== profileToShowName && (
                <HeaderButtons>
                  {!following ? (
                    <FollowButton following={following} onClick={handleFollow}>
                      <FaRegHeart size={'16px'} style={{ flexShrink: 0 }} />
                      <span>Seguir</span>
                    </FollowButton>
                  ) : (
                    <FollowButton following={following} onClick={handleFollow}>
                      <FaHeart size={'16px'} style={{ flexShrink: 0 }} />
                      <span>Seguindo</span>
                    </FollowButton>
                  )}
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
                {authentication &&
                  authentication.profile.name === profileToShowName && (
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
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}` && (
          <Start profileToShowId={profile.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/lists` && (
          <Lists profileToShowId={profile.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/polls` && (
          <Polls profileToShowId={profile.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/votes` &&
          authentication &&
          authentication.profile.name === profileToShowName && (
            <Votes profileToShowId={profile.id} />
          )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/following` && (
          <Following profileToShowId={profile.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/about` && (
          <About profileAbout={profile.about} />
        )}
      </Main>
      <Modal show={showUnfollowDialog} setShow={setShowUnfollowDialog}>
        <ConfirmUnfollowDialog
          profileDisplayName={profile.display_name}
          handleConfirm={handleUnfollow}
          handleCancel={() => setShowUnfollowDialog(false)}
        />
      </Modal>
    </Container>
  );
};

export default Profile;
