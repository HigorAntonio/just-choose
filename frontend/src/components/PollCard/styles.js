import styled, { css } from 'styled-components';

export const Container = styled.div`
  &:hover {
    cursor: pointer;
  }

  > a {
    text-decoration: none;
  }
`;

export const CardWrapper = styled.div``;

export const Top = styled.div`
  position: relative;
`;

export const ThumbWrapper = styled.div`
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
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  ${(props) => props.error && 'display: none;'}
`;

export const TimeFromNow = styled.span`
  background: rgba(0, 0, 0, 0.6);
  font-size: 1.4rem;
  color: var(--white);
  padding: 0.2rem 0.4rem;
  border-radius: 2px;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
`;

export const Bottom = styled.div`
  display: flex;
  margin-top: 1rem;
`;

export const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: var(--background-700);
  flex-shrink: 0;
  margin-right: 1rem;

  > a {
    width: 3.6rem;
    height: 3.6rem;
  }
`;

export const ProfileImage = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  ${(props) => props.error && 'display: none;'}
`;

const textOverflowEllipsis = css`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
`;

export const Title = styled.h3`
  ${textOverflowEllipsis}
  font-size: 1.6rem;
  margin-bottom: 0.3rem;
`;

const metaChield = css`
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
`;

export const ProfileName = styled.span`
  ${metaChield}
  ${textOverflowEllipsis}

  > a {
    text-decoration: none;

    &:hover {
      color: var(--primary-400);
    }
  }
`;

export const PollStatus = styled.span`
  ${metaChield}
`;

export const TotalVotes = styled.span`
  ${metaChield}
`;

export const Meta = styled.div`
  > ${PollStatus}, ${TotalVotes} {
    display: inline-block;
  }
`;

export const MetaSeparator = styled.span`
  font-size: 1.5rem;
  margin: 0 0.4rem;
`;
