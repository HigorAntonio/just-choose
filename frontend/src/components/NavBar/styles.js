import styled from 'styled-components';

import breakpoints from '../../styles/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 100%;

  background: var(--background-510);
`;

export const TopSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding-right: 1rem;
  overflow-y: hidden;

  &:hover {
    overflow-y: auto;
  }

  /* Scrollbar on Firefox */
  scrollbar-width: auto;
  scrollbar-color: var(--dark-gray) var(--background-510);

  /* Scrollbar on Chrome, Edge, and Safari */
  &::-webkit-scrollbar-track {
    background: var(--background-510);
  }
`;

export const Navigation = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 1rem 0;
  border-bottom: 0.1rem solid var(--background-700);

  > a {
    text-decoration: none;
  }
`;

export const Following = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 1rem 0;
`;

export const NavOption = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 4.2rem;

  padding: 0.5rem 1rem;

  &:hover {
    background: var(--background-600);
    cursor: pointer;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > div span {
    font-size: 1.5rem;
    font-weight: 500;

    margin-left: 1rem;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: ${breakpoints.size1}) {
    > div {
      display: none;
    }

    &:hover {
      background: transparent;
    }
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin: 1rem;

  > h5 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  @media (max-width: ${breakpoints.size1}) {
    display: none;
  }
`;

export const Profiles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > a {
    text-decoration: none;
  }
`;

export const Profile = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 4.2rem;

  padding: 0.5rem 1rem;

  &:hover {
    background: var(--background-600);
    cursor: pointer;
  }

  @media (max-width: ${breakpoints.size1}) {
    &:hover {
      background: transparent;
    }
  }
`;

export const ProfileImage = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  background-color: var(--background-700);
  flex-shrink: 0;
`;

export const ProfileData = styled.div`
  display: flex;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;

  > span {
    font-size: 1.5rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;

    margin-left: 1rem;
  }

  @media (max-width: ${breakpoints.size1}) {
    display: none;
  }
`;

export const BottomSide = styled.div`
  width: 100%;
  padding: 1rem;

  border-top: 0.1rem solid var(--background-700);
`;

export const SearchProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  > svg {
    position: absolute;
    left: 0.85rem;
  }
`;

export const SearchProfileInput = styled.input`
  width: 100%;
  height: 3rem;

  font-size: 1.4rem;
  border: 0.2rem solid var(--background-700);
  border-radius: 0.3rem;
  padding: 0.5rem 1rem 0.5rem 3rem;

  outline: 0;

  &:hover {
    border: 0.2rem solid var(--gray);
  }

  &:focus {
    border: 0.2rem solid var(--primary-400);
  }

  transition: border 0.3s;

  background: var(--background-700);
`;

export const NoResults = styled.span`
  padding: 1rem;
  font-size: 1.5rem;
  color: var(--dark-gray);
`;
