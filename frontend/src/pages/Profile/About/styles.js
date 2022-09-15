import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    margin-bottom: 3rem;
  }
`;

export const DescriptionWrapper = styled.div`
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 4rem;
  background: var(--background-100);

  > h3 {
    font-size: 2.4rem;
    margin-bottom: 1rem;
  }
`;

export const Description = styled.p`
  word-break: break-word;
  margin-bottom: 1rem;
`;
