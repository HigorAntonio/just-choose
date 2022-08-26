import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
