import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  &:hover {
    cursor: pointer;
  }

  > a {
    width: 100%;
    height: 100%;
    display: flex;
    text-decoration: none;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 136px;
  height: 136px;
  background: var(--background-600);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 76px;
    height: 76px;
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

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const UserName = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  font-size: 1.9rem;
  margin-top: 1rem;

  &:hover {
    color: var(--primary-400);
  }
`;

export const Meta = styled.div``;

export const FollowersCount = styled.span`
  font-size: 1.5rem;
`;

export const MetaSeparator = styled.span`
  font-size: 1.5rem;
  margin: 0 4px;
`;

export const DescriptionWrapper = styled.div`
  padding-right: 20px;
  margin-bottom: 8px;
  margin-top: 10px;
`;

export const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  font-size: 1.5rem;
`;
