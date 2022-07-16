import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ThumbnailContainer = styled.div`
  width: 50%;
  max-width: 36rem;
  margin-right: 20px;

  @media (max-width: 1024px) {
    width: 35%;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

export const ThumbnailWrapper = styled.div`
  background: var(--background-600);
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: calc(9 / 16 * 100%);
  position: relative;
  overflow: hidden;

  > a {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }

  > a svg {
    width: 50%;
    height: 50%;
    flex-shrink: 0;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const TimeFromNow = styled.div`
  background: rgba(0, 0, 0, 0.6);
  font-size: 1.4rem;
  color: var(--white);
  padding: 2px 4px;
  border-radius: 2px;
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const TextWrapperLargeScreen = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Title = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
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

export const Likes = styled.span`
  font-size: 1.5rem;
`;

export const Forks = styled.span`
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

export const ProfileName = styled.p`
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

  > a {
    width: 24px;
    height: 24px;
  }
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
  word-break: break-word;
  overflow: hidden;
  font-size: 1.5rem;
`;

export const TextWrapperSmallScreen = styled.div`
  display: none;
  padding-bottom: 5px;

  > ${ProfileImageWrapper}, ${ProfileImageWrapper} a,
  ${ProfileImage} {
    width: 48px;
    height: 48px;
  }

  > ${Meta} ${ProfileName}, ${Meta} ${Likes}, ${Meta} ${Forks} {
    display: inline-block;
  }

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
  }
`;
