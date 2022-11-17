import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`;

export const CardWrapper = styled.div`
  display: flex;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;

export const SkeletonWrapper = styled.div`
  position: relative;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;
