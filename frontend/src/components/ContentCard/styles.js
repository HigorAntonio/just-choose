import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--background-500);
  display: flex;
  align-items: center;
  justify-content: center;

  > div.check-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0.5rem;
    width: 3rem;
    height: 3rem;
    background: rgba(0, 0, 0, 0.55);

    &::before {
      content: '';
      position: absolute;
      top: 3rem;
      left: 0;
      border-top: 0.75rem solid rgba(0, 0, 0, 0.55);
      border-right: 0.75rem solid transparent;
      border-bottom: 0.75rem solid transparent;
      border-left: 0.75rem solid rgba(0, 0, 0, 0.55);
    }

    &::after {
      content: '';
      position: absolute;
      top: 3rem;
      right: 0;
      border-top: 0.75rem solid rgba(0, 0, 0, 0.55);
      border-right: 0.75rem solid rgba(0, 0, 0, 0.55);
      border-bottom: 0.75rem solid transparent;
      border-left: 0.75rem solid transparent;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        top: 3rem;
        left: 0;
        border-top: 0.75rem solid rgba(0, 0, 0, 0.8);
        border-right: 0.75rem solid transparent;
        border-bottom: 0.75rem solid transparent;
        border-left: 0.75rem solid rgba(0, 0, 0, 0.8);
      }

      &::after {
        content: '';
        position: absolute;
        top: 3rem;
        right: 0;
        border-top: 0.75rem solid rgba(0, 0, 0, 0.8);
        border-right: 0.75rem solid rgba(0, 0, 0, 0.8);
        border-bottom: 0.75rem solid transparent;
        border-left: 0.75rem solid transparent;
      }
    }
  }
`;

export const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.error && 'display: none;'}
`;
