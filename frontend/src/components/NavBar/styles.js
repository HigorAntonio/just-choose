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

  padding-right: 10px;
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

  padding: 10px 0;
  border-bottom: 1px solid var(--background-700);

  > a {
    text-decoration: none;
  }
`;

export const Following = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 10px 0;
`;

export const NavOption = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 42px;

  padding: 5px 10px;

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
    font-size: 15px;
    font-weight: 500;

    margin-left: 10px;

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
  margin: 10px;

  > h5 {
    font-size: 15px;
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
`;

export const Profile = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 42px;

  padding: 5px 10px;

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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--gray);
  flex-shrink: 0;
`;

export const ProfileData = styled.div`
  display: flex;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;

  > span {
    font-size: 15px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;

    margin-left: 10px;
  }

  @media (max-width: ${breakpoints.size1}) {
    display: none;
  }
`;

export const BottomSide = styled.div`
  width: 100%;
  padding: 10px;

  border-top: 1px solid var(--background-700);
`;

export const SearchUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  > svg {
    position: absolute;
    left: 8.5px;
  }
`;

export const SearchUserInput = styled.input`
  width: 100%;
  height: 30px;

  border: 2px solid var(--background-700);
  border-radius: 3px;
  padding: 5px 10px 5px 30px;

  outline: 0;

  &:hover {
    border: 2px solid var(--gray);
  }

  &:focus {
    border: 2px solid var(--primary-400);
  }

  transition: border 0.3s;

  background: var(--background-700);
`;

export const NoResults = styled.span`
  padding: 10px;
  font-size: 15px;
  color: var(--dark-gray);
`;
