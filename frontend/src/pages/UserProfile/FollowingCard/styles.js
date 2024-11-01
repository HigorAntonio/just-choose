import styled from 'styled-components';

export const Container = styled.div`
  > a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 10.3rem;
  height: 10.3rem;
  background: var(--background-600);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const UserName = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  font-size: 1.9rem;
  text-align: center;

  &:hover {
    color: var(--primary-400);
  }
`;

export const Meta = styled.div``;

export const FollowersCount = styled.span`
  font-size: 1.5rem;
`;
