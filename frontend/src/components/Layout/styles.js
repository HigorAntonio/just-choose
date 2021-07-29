import styled from 'styled-components';

import breakpoints from '../../styles/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const BodyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const NavBarWrapper = styled.div`
  width: 25.5rem;
  height: 100%;
  position: sticky;
  top: 0;

  @media (max-width: ${breakpoints.size1}) {
    width: 5.5rem;
  }

  @media (max-width: ${breakpoints.size5}) {
    display: none;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;
