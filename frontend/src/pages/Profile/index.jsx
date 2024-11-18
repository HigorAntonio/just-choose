import React, { useState, useEffect, useContext } from 'react';
import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import { FollowingProfilesContext } from '../../context/FollowingProfilesContext';

import justChooseApi from '../../services/justChooseApi';
import useQuery from '../../hooks/useQuery';
import useMutation from '../../hooks/useMutation';
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

  const queryClient = useQueryClient();

  const [profileImageError, setProfileImageError] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

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
        authentication?.profile?.name !== profileToShowName)
    ) {
      history.replace(`${path.replace(':name', profileToShowName)}`);
    }
  }, [location, path, profileToShowName, authentication, history]);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef, location]);

  const {
    isFetching: isFetchingProfile,
    error: errorProfile,
    data: profileData,
  } = useQuery(
    ['profile/profileData', profileToShowName],
    async () => {
      const response = await justChooseApi.get(
        `/profiles/${profileToShowName}`
      );
      return response.data;
    },
    { retry: false }
  );

  const { data: followingData } = useQuery(
    ['profile/followingProfileData', authentication, profileData],
    async () => {
      const response = await justChooseApi.get(
        `/profiles/following/${profileData?.id}`
      );
      return response.data.following;
    },
    {
      retry: false,
      enabled: !!authentication?.profile?.is_active && !!profileData?.id,
    }
  );

  const followMutation = useMutation(
    async (variables) => {
      return await justChooseApi.post(`/profiles/follow`, variables);
    },
    {
      onSuccess: () => {
        refetchFollowingProfilesData();
        queryClient.setQueryData(
          ['profile/profileData', profileToShowName],
          (oldData) => ({
            ...oldData,
            followers_count: oldData.followers_count + 1,
          })
        );
        queryClient.setQueryData(
          ['profile/followingProfileData', authentication, profileData],
          true
        );
      },
    }
  );

  const unfollowMutation = useMutation(
    async (variables) => {
      return await justChooseApi.delete(`/profiles/follow`, {
        data: variables,
      });
    },
    {
      onSuccess: () => {
        refetchFollowingProfilesData();
        queryClient.setQueryData(
          ['profile/profileData', profileToShowName],
          (oldData) => ({
            ...oldData,
            followers_count: oldData.followers_count - 1,
          })
        );
        queryClient.setQueryData(
          ['profile/followingProfileData', authentication, profileData],
          false
        );
      },
    }
  );

  const handleUnfollow = () => {
    setShowUnfollowDialog(false);
    unfollowMutation.mutate({ followsId: profileData?.id });
  };

  const handleFollowButton = () => {
    if (!authentication || authentication?.profile?.is_active === false) {
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
    if (followingData) {
      setShowUnfollowDialog(true);
    } else {
      followMutation.mutate({ followsId: profileData?.id });
    }
  };

  const handlePush = (path) => {
    history.push(path);
  };

  if (isFetchingProfile) {
    return <></>;
  }
  if (errorProfile) {
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
                    profileData?.profile_image_url
                      ? profileData?.profile_image_url
                      : ''
                  }
                  onError={() => setProfileImageError(true)}
                  error={profileImageError}
                />
              </ProfileImageWrapper>
              <ProfileMeta>
                <ProfileName>{profileData?.display_name}</ProfileName>
                <ProfileFollowers>{`${profileData?.followers_count} ${
                  profileData?.followers_count === 1 ? 'seguidor' : 'seguidores'
                }`}</ProfileFollowers>
              </ProfileMeta>
            </ProfileWrapper>
            {authentication?.profile?.name !== profileToShowName && (
              <HeaderButtons>
                {!followingData ? (
                  <FollowButton
                    following={followingData}
                    onClick={handleFollowButton}
                    disabled={
                      followMutation.isLoading || unfollowMutation.isLoading
                    }
                  >
                    <FaRegHeart size={'16px'} style={{ flexShrink: 0 }} />
                    <span>Seguir</span>
                  </FollowButton>
                ) : (
                  <FollowButton
                    following={followingData}
                    onClick={handleFollowButton}
                    disabled={
                      followMutation.isLoading || unfollowMutation.isLoading
                    }
                  >
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
                  tabIndex="0"
                >
                  Início
                </div>
                <div
                  className={
                    location.pathname === `${url}/lists` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/lists`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/lists`)}
                  tabIndex="0"
                >
                  Listas
                </div>
                <div
                  className={
                    location.pathname === `${url}/polls` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/polls`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/polls`)}
                  tabIndex="0"
                >
                  Votações
                </div>
                {authentication?.profile?.name === profileToShowName && (
                  <div
                    className={
                      location.pathname === `${url}/votes` ? 'active' : ''
                    }
                    onClick={() => handlePush(`${url}/votes`)}
                    onAuxClick={(e) => navOnAuxClick(e, `${url}/votes`)}
                    tabIndex="0"
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
                  tabIndex="0"
                >
                  Seguindo
                </div>
                <div
                  className={
                    location.pathname === `${url}/about` ? 'active' : ''
                  }
                  onClick={() => handlePush(`${url}/about`)}
                  onAuxClick={(e) => navOnAuxClick(e, `${url}/about`)}
                  tabIndex="0"
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
          <Start profileToShowId={profileData?.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/lists` && (
          <Lists profileToShowId={profileData?.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/polls` && (
          <Polls profileToShowId={profileData?.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/votes` &&
          authentication?.profile?.name === profileToShowName && (
            <Votes profileToShowId={profileData?.id} />
          )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/following` && (
          <Following profileToShowId={profileData?.id} />
        )}
        {location.pathname ===
          `${path.replace(':name', profileToShowName)}/about` && (
          <About profileAbout={profileData?.about} />
        )}
      </Main>
      <Modal
        show={showUnfollowDialog}
        setShow={setShowUnfollowDialog}
        autoFocusCloseButton
      >
        <ConfirmUnfollowDialog
          profileDisplayName={profileData?.display_name}
          handleConfirm={handleUnfollow}
          handleCancel={() => setShowUnfollowDialog(false)}
        />
      </Modal>
    </Container>
  );
};

export default Profile;
