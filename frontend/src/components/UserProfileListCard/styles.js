import styled from 'styled-components';

export const Container = styled.div``;

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
  width: auto;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  flex-shrink: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
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

export const Bottom = styled.div`
  height: 6.2rem;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;

export const Title = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  font-size: 1.6rem;
  margin-bottom: 3px;
`;

export const Meta = styled.div``;

export const MetaSeparator = styled.span`
  font-size: 1.5rem;
  margin: 0 4px;
`;

export const Likes = styled.span`
  font-size: 1.4rem;
`;

export const Forks = styled.span`
  font-size: 1.4rem;
`;
