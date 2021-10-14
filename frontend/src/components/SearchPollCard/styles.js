import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  &:hover {
    cursor: pointer;
  }
`;

export const ThumbnailWrapper = styled.div`
  width: 360px;
  height: 202.5px;
  background: var(--background-600);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;

  > a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > a svg {
    width: 50%;
    height: 50%;
    flex-shrink: 0;
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Title = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1.9rem;

  > a {
    text-decoration: none;

    &:hover {
      color: var(--primary-400);
    }
  }
`;

export const Meta = styled.div``;

export const PollStatus = styled.span`
  font-size: 1.5rem;
`;

export const MetaSeparator = styled.span`
  font-size: 1.5rem;
  margin: 0 4px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
`;

export const UserName = styled.p`
  font-size: 1.5rem;

  > a {
    text-decoration: none;

    &:hover {
      color: var(--primary-400);
    }
  }
`;

export const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--background-700);
  flex-shrink: 0;
  margin-right: 8px;
`;

export const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const DescriptionWrapper = styled.div`
  padding-right: 20px;
  margin-bottom: 8px;
`;

export const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1.5rem;
`;
