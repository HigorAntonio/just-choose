import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--background-500);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.error && 'display: none;'}
`;
