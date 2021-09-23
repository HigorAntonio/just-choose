import React, { useState, useEffect } from 'react';
import { useParams, useRouteMatch, useLocation, Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import TooltipHover from '../../components/TooltipHover';

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
        <Navigation>
          <div className={location.pathname === `${url}` ? 'active' : ''}>
            <Link to={`${url}`}>Início</Link>
          </div>
          <div className={location.pathname === `${url}/lists` ? 'active' : ''}>
            <Link to={`${url}/lists`}>Listas</Link>
          </div>
          <div className={location.pathname === `${url}/polls` ? 'active' : ''}>
            <Link to={`${url}/polls`}>Votações</Link>
          </div>
          <div
            className={location.pathname === `${url}/following` ? 'active' : ''}
          >
            <Link to={`${url}/following`}>Seguindo</Link>
          </div>
          <div className={location.pathname === `${url}/about` ? 'active' : ''}>
            <Link to={`${url}/about`}>Sobre</Link>
          </div>
        </Navigation>
      </NavigationWrapper>
      <Main></Main>
    </Container>
  );
};

export default UserProfile;
