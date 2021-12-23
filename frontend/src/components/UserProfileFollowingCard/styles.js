import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1.9rem;

  &:hover {
    color: var(--primary-400);
  }
`;

export const Meta = styled.div``;

export const FollowersCount = styled.span`
  font-size: 1.5rem;
`;
