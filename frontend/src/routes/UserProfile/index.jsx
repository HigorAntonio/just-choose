import React, { useState, useEffect, useContext } from 'react';
import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';
import { FollowingProfilesContext } from '../../context/FollowingProfilesContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import TooltipHover from '../../components/TooltipHover';
import HorizontalDragScrolling from '../../components/HorizontalDragScrolling';
import UserProfileStart from '../../components/UserProfileStart';
import UserProfileLists from '../../components/UserProfileLists';
import UserProfilePolls from '../../components/UserProfilePolls';
import UserProfileFollowing from '../../components/UserProfileFollowing';

import {
  Container,
  StickyWrapper,
  Header,
  ProfileWrapper,
  Layout,
  ProfileImage,
  ProfileImageWrapper,
  ProfileName,
  ProfileFollowers,
  HeaderButtons,
  FollowButton,
  Navigation,
  NavigationWrapper,
  Main,
} from './styles';

const UserProfile = ({ wrapperRef }) => {
  const history = useHistory();
  const { id: profileId } = useParams();
  const { path, url } = useRouteMatch();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname !== `${path.replace(':id', profileId)}` &&
      location.pathname !== `${path.replace(':id', profileId)}/lists` &&
      location.pathname !== `${path.replace(':id', profileId)}/polls` &&
      location.pathname !== `${path.replace(':id', profileId)}/following` &&
      location.pathname !== `${path.replace(':id', profileId)}/about`
    ) {
      history.replace(`${path.replace(':id', profileId)}`);
    }
  }, [location, path, profileId, history]);

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef, location]);

  const { userId, authenticated } = useContext(AuthContext);
  const {
    userProfile: { is_active: isUserActive },
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

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileImageError, setProfileImageError] = useState(false);

  const clearState = () => {
    setLoadingError(false);
    setFollowing(false);
    setProfile({});
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        clearState();
        const { data } = await justChooseApi.get(`/users/${profileId}`);
        setProfile(data);
        if (authenticated && isUserActive) {
          const {
            data: { following },
          } = await justChooseApi.get(`/users/following/${profileId}`);
          setFollowing(following);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setLoadingError(true);
      }
    })();
  }, [profileId, authenticated, isUserActive]);

  const handleFollow = async () => {
    if (!authenticated || !isUserActive) {
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
        await justChooseApi.post(`/users/follow`, { followsId: profileId });
        setProfile((prevState) => ({
          ...prevState,
          followers_count: prevState.followers_count + 1,
        }));
        setFollowingList((prevState) => [
          ...prevState,
          {
            user_id: profile.id,
            user_name: profile.name,
            profile_image_url: profile.profile_image_url,
          },
        ]);
      }
      if (following) {
        await justChooseApi.delete(`/users/follow`, {
          data: { followsId: profileId },
        });
        setProfile((prevState) => ({
          ...prevState,
          followers_count: prevState.followers_count - 1,
        }));
        setFollowingList((prevState) =>
          prevState.filter((fl) => fl.user_id !== profile.id)
        );
      }
      setFollowing((prevState) => !prevState);
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
          <ProfileWrapper>
            <Layout>
              <ProfileImageWrapper>
                <ProfileImage
                  src={
                    profile.profile_image_url ? profile.profile_image_url : ''
                  }
                  onError={() => setProfileImageError(true)}
                  error={profileImageError}
                />
              </ProfileImageWrapper>
              <Layout className="column justify-center">
                <ProfileName>{profile.name}</ProfileName>
                <ProfileFollowers>{`${profile.followers_count} ${
                  profile.followers_count === 1 ? 'seguidor' : 'seguidores'
                }`}</ProfileFollowers>
              </Layout>
            </Layout>
            <Layout>
              <HeaderButtons>
                {parseInt(userId) !== parseInt(profileId) && (
                  <TooltipHover
                    tooltipText={!following ? 'Seguir' : 'Deixar de seguir'}
                    width={!following ? '55px' : '110px'}
                  >
                    <FollowButton following={following} onClick={handleFollow}>
                      {!following && (
                        <FaRegHeart size={'25px'} style={{ flexShrink: 0 }} />
                      )}
                      {following && (
                        <FaHeart size={'25px'} style={{ flexShrink: 0 }} />
                      )}
                    </FollowButton>
                  </TooltipHover>
                )}
              </HeaderButtons>
            </Layout>
          </ProfileWrapper>
        </Header>
        <NavigationWrapper>
          <HorizontalDragScrolling>
            <Navigation>
              <div
                className={location.pathname === `${url}` ? 'active' : ''}
                onClick={() => handlePush(url)}
              >
                {/* <Link to={`${url}`}>Início</Link> */}
                Início
              </div>
              <div
                className={location.pathname === `${url}/lists` ? 'active' : ''}
                onClick={() => handlePush(`${url}/lists`)}
              >
                {/* <Link to={`${url}/lists`}>Listas</Link> */}
                Listas
              </div>
              <div
                className={location.pathname === `${url}/polls` ? 'active' : ''}
                onClick={() => handlePush(`${url}/polls`)}
              >
                {/* <Link to={`${url}/polls`}>Votações</Link> */}
                Votações
              </div>
              <div
                className={
                  location.pathname === `${url}/following` ? 'active' : ''
                }
                onClick={() => handlePush(`${url}/following`)}
              >
                {/* <Link to={`${url}/following`}>Seguindo</Link> */}
                Seguindo
              </div>
              <div
                className={location.pathname === `${url}/about` ? 'active' : ''}
                onClick={() => handlePush(`${url}/about`)}
              >
                {/* <Link to={`${url}/about`}>Sobre</Link> */}
                Sobre
              </div>
            </Navigation>
          </HorizontalDragScrolling>
        </NavigationWrapper>
      </StickyWrapper>
      <Main>
        {location.pathname === `${path.replace(':id', profileId)}` && (
          <UserProfileStart />
        )}
        {location.pathname === `${path.replace(':id', profileId)}/lists` && (
          <UserProfileLists />
        )}
        {location.pathname === `${path.replace(':id', profileId)}/polls` && (
          <UserProfilePolls />
        )}
        {location.pathname ===
          `${path.replace(':id', profileId)}/following` && (
          <UserProfileFollowing />
        )}
      </Main>
    </Container>
  );
};

export default UserProfile;
