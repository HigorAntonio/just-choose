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
    background: var(--background-900);
    border-radius: 0 0 0.5rem 0.5rem;

    &:hover,
    &:focus-visible {
      background: var(--primary-500);
      cursor: pointer;
    }
  }
`;

export const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.error && 'display: none;'}
`;
