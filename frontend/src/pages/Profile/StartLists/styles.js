import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const Title = styled.h3`
  font-size: 1.8rem;
`;

export const Main = styled.div`
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

export const LineWrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 1rem 0;
  margin: 0.5rem 0 2.5rem 0;
`;

export const Line = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  border-top: 0.1rem solid var(--background-700);
`;
