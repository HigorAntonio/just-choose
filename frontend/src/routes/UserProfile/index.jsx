import React, { useState, useEffect } from 'react';
import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

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
  const { id: userProfileId } = useParams();
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const [following, setFollowing] = useState(false);

  useEffect(() => console.debug('url:', url), [url]);
  useEffect(() => console.debug('path:', path), [path]);
  useEffect(() => console.debug('location:', location), [location]);

  const handleFollow = () => {
    setFollowing((prevState) => !prevState);
  };

  const handlePush = (path) => {
    history.push(path);
  };

  return (
    <Container>
      <Header>
        <ProfileWrapper>
          <Layout>
            <ProfileImageWrapper>
              <ProfileImage src="#" alt="" />
            </ProfileImageWrapper>
            <Layout className="column justify-center">
              <ProfileName>UserName</ProfileName>
              <ProfileFollowers>234 seguidores</ProfileFollowers>
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
