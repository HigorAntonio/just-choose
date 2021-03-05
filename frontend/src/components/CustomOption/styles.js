import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: var(--search);
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;
