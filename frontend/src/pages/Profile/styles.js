import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: var(--background-410);
`;

export const StickyWrapper = styled.div`
  width: 100%;
  position: sticky;
  z-index: 300;
  top: 0;
  background: var(--background-410);
`;

export const Header = styled.header`
  width: calc(100% - 8rem);
  max-width: 200rem;
  margin: 0 auto;
  padding-top: 2rem;
  background: var(--background-410);

  @media (max-width: 768px) {
    width: calc(100% - 3rem);
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

export const ProfileWrapper = styled.div`
  width: max(18.2rem, calc(100% - 16.2rem));
  display: flex;
  align-items: center;

  @media (max-width: 650px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 7.2rem;
  height: 7.2rem;
  background: var(--background-700);
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  border-radius: 50%;

  @media (max-width: 650px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const ProfileMeta = styled.div`
  width: max(10rem, calc(100% - 8.2rem));
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 650px) {
    width: 100%;
    align-items: center;
  }
`;

export const ProfileName = styled.h1`
  max-width: 100%;
  font-size: 2.4rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;

  @media (max-width: 650px) {
    max-width: 70%;
  }
`;

export const ProfileFollowers = styled.p`
  font-size: 1.4rem;
`;

export const HeaderButtons = styled.div`
  margin: 0 2.5rem;

  @media (max-width: 650px) {
    margin: 2.5rem 0 0 0;
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--background-600);
  outline: none;

  > span {
    margin-left: 1rem;
    font-size: 1.6rem;
  }

  &:hover {
    background: var(--background-700);
    cursor: pointer;
  }
`;

export const FollowButton = styled.button`
  ${buttonCss}
  font-weight: 500;
  ${(props) => !props.following && `background: var(--primary-400);`}

  > span {
    ${(props) => !props.following && `color: var(--white);`}
  }

  > svg {
    ${(props) => !props.following && `fill: var(--white);`}
  }

  &:hover {
    ${(props) =>
      props.following
        ? `background: var(--light-red);`
        : `background: var(--primary-500);`}

    > span {
      ${(props) => props.following && `color: var(--black);`}
    }

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
`;

export const Navigation = styled.div`
  height: 4rem;
  display: flex;

  > div {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
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
      border-bottom: 0.2rem solid var(--primary-400);
    }
  }

  > div + div {
    margin-left: 2rem;
  }
`;

export const Main = styled.div`
  width: calc(100% - 8rem);
  max-width: 200rem;
  margin: 0 auto;
  padding-top: 2rem;

  @media (max-width: 768px) {
    width: calc(100% - 3rem);
  }
`;
