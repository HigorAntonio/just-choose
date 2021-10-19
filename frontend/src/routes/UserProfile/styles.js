import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px 30px 10px 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Layout = styled.div`
  display: flex;

  &.column {
    flex-direction: column;
  }

  &.justify-center {
    justify-content: center;
  }

  &.justify-space-between {
    justify-content: space-between;
  }

  &.align-center {
    align-items: center;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--background-700);
  margin-right: 10px;
`;

export const ProfileImage = styled.img``;

export const ProfileName = styled.h1`
  font-size: 2.4rem;
`;

export const ProfileFollowers = styled.p`
  font-size: 1.4rem;
`;

export const HeaderButtons = styled.div`
  margin-right: 50px;
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 10px;
  background: var(--background-600);
  outline: none;

  > span {
    margin-left: 10px;
    font-size: 25px;
  }

  &:hover {
    background: var(--background-700);
    cursor: pointer;
  }
`;

export const FollowButton = styled.button`
  ${buttonCss}

  &:hover {
    ${(props) => props.following && `background: var(--light-red);`}

    > svg {
      ${(props) => props.following && `fill: var(--black);`}
    }
  }
`;

export const NavigationWrapper = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  padding: 0 30px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const Navigation = styled.div`
  height: 100%;
  display: flex;

  > div {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    user-select: none;
    font-weight: 500;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;

    &:hover,
    &.active {
      cursor: pointer;
      color: var(--primary-400);
      text-decoration: none;
    }

    &.active {
      border-bottom: 2px solid var(--primary-400);
    }
  }

  > div + div {
    margin-left: 2rem;
  }
`;

export const Main = styled.div`
  width: 100%;
`;
