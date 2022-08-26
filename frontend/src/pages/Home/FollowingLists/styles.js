import styled from 'styled-components';

export const Container = styled.div``;

export const TitleWrapper = styled.div`
  padding-bottom: 1rem;
`;

export const Title = styled.h2`
  font-size: 2rem;
`;

export const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
  margin-bottom: 1rem;

  > div {
    flex: 1;
    padding: 0 0.5rem;
  }

  > div:first-of-type {
    padding: 0 0.5rem 0 0;
  }

  > div:last-of-type {
    padding: 0 0 0 0.5rem;
  }

  > div:only-child {
    padding: 0;
  }
`;
