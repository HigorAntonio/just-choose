import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 240px;
  height: 100%;

  background: var(--nav-bar);
`;

export const TopSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
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

  overflow: hidden;
  text-overflow: ellipsis;

  > span {
    font-size: 15px;
    font-weight: 500;

    margin-left: 10px;

    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BottomSide = styled.div`
  width: 100%;
  padding: 10px;

  border-top: 1px solid var(--search);
`;

export const SearchUser = styled.div``;

export const SearchUserInput = styled.input`
  width: 100%;
  height: 30px;

  border: 2px solid var(--search);
  border-radius: 3px;
  padding: 5px 10px;

  outline: 0;

  &:hover {
    border: 2px solid var(--gray);
  }

  &:focus {
    border: 2px solid var(--accent);
  }

  transition: border 0.3s;

  background: var(--search);
`;
