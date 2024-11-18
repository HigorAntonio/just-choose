import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--background-400);
  border-radius: 0.5rem;

  &:hover,
  &:focus-visible {
    background: var(--background-500);
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0.2rem solid var(--primary-400);
  }
`;
