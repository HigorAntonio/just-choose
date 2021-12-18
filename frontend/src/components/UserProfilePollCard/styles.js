import styled from 'styled-components';

export const Container = styled.div``;

export const CardWrapper = styled.div`
  /* background: var(--background-500); */
  /* width: 100%;
  height: 100%;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(252 / 320 * 100%);
  } */
`;

export const Top = styled.div`
  position: relative;
`;

export const ThumbWrapper = styled.div`
  background: var(--background-600);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(180 / 320 * 100%);
  }

  > svg {
    width: 25%;
    height: 25%;
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
  overflow: hidden;
  font-size: 1.6rem;
  margin-bottom: 3px;
`;

export const Meta = styled.div``;

export const MetaSeparator = styled.span`
  font-size: 1.5rem;
  margin: 0 4px;
`;

export const PollStatus = styled.span`
  font-size: 1.4rem;
`;
