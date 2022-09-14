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
  margin-right: 2rem;

  @media (max-width: 1024px) {
    width: 35%;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
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

  > svg {
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
  position: absolute;
  left: 0;
  top: 0;
  ${(props) => props.error && 'display: none;'}
`;

export const TimeFromNow = styled.div`
  background: rgba(0, 0, 0, 0.6);
  font-size: 1.4rem;
  color: var(--white);
  padding: 0.2rem 0.4rem;
  border-radius: 0.2rem;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
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
  margin: 0 0.4rem;
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem 0;
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
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background-color: var(--background-700);
  flex-shrink: 0;
  margin-right: 0.8rem;

  > a {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

export const ProfileImage = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => (props.error || !props.src) && 'display: none;'}
`;

export const DescriptionWrapper = styled.div`
  padding-right: 2rem;
  margin-bottom: 0.8rem;
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
  padding-bottom: 0.5rem;

  > ${ProfileImageWrapper}, ${ProfileImageWrapper} a,
  ${ProfileImage} {
    width: 4.8rem;
    height: 4.8rem;
  }

  > ${Meta} ${ProfileName}, ${Meta} ${Likes}, ${Meta} ${Forks} {
    display: inline-block;
  }

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
  }
`;
