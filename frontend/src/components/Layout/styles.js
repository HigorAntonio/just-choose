import styled from 'styled-components';

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
`;

export const BodyWrapper = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
`;

export const NavBarWrapper = styled.div`
  width: 240px;
  height: 100%;
  position: sticky;
  top: 0;
`;

export const ContentWrapper = styled.div``;
