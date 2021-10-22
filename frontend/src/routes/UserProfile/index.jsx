import React, { useState, useEffect, useContext } from 'react';
import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import TooltipHover from '../../components/TooltipHover';
import HorizontalDragScrolling from '../../components/HorizontalDragScrolling';

import {
  Container,
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

  const { userId, authenticated } = useContext(AuthContext);

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
        if (authenticated) {
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
  }, [profileId, authenticated]);

  const handleFollow = () => {
    setFollowing((prevState) => !prevState);
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
      <Header>
        <ProfileWrapper>
          <Layout>
            <ProfileImageWrapper>
              <ProfileImage
                src={profile.profile_image_url ? profile.profile_image_url : ''}
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
      <Main></Main>
    </Container>
  );
};

export default UserProfile;
