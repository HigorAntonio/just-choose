import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    margin-bottom: 3rem;
  }
`;

export const Message = styled.span`
  font-size: 1.8rem;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  color: var(--dark-gray);
  padding: 5rem 0;
`;
